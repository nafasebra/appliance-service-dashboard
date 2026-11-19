import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const layers = ['app', 'pages', 'features', 'entities', 'shared'];
const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`],
  );
const files = walk('src').filter((file) => /\.(ts|tsx)$/.test(file));
const errors = [];
let imports = 0;
const slice = (file) => {
  const [, layer, name] = file.split('/');
  return ['pages', 'features', 'entities'].includes(layer) ? `${layer}/${name}` : undefined;
};
const sharedOwner = (file) =>
  file
    .split('/')
    .slice(0, file.startsWith('src/shared/ui/') ? 4 : 3)
    .join('/');
const resolve = (file, specifier) => {
  const base = specifier.startsWith('@/')
    ? `src/${specifier.slice(2)}`
    : specifier.startsWith('.')
      ? path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier))
      : undefined;
  return (
    base &&
    [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find(
      (name) => existsSync(name) && /\.(ts|tsx|json)$/.test(name),
    )
  );
};

for (const file of files) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  const check = (specifier, node) => {
    const target = resolve(file, specifier);
    if (!target) {
      if ((specifier.startsWith('.') || specifier.startsWith('@/')) && !specifier.endsWith('.css'))
        errors.push(`${file}: unresolved local module ${specifier}`);
      return;
    }
    imports++;
    const from = file.split('/')[1],
      to = target.split('/')[1];
    const sourceSlice = slice(file),
      targetSlice = slice(target);
    const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
    const report = (message) => errors.push(`${file}:${line}: ${message} (${specifier})`);
    if (layers.indexOf(from) > layers.indexOf(to)) report(`upward dependency ${from} -> ${to}`);
    const crossEntity =
      from === 'entities' &&
      to === 'entities' &&
      ts.isImportDeclaration(node) &&
      node.importClause?.isTypeOnly &&
      target === `src/${targetSlice}/@x/${sourceSlice?.split('/')[1]}.ts`;
    if (from === to && sourceSlice && targetSlice && sourceSlice !== targetSlice && !crossEntity)
      report('same-layer slice dependency');
    if (
      targetSlice &&
      sourceSlice !== targetSlice &&
      !crossEntity &&
      target !== `src/${targetSlice}/index.ts`
    )
      report('import the slice public API');
    if (
      sourceSlice &&
      sourceSlice === targetSlice &&
      target === `src/${targetSlice}/index.ts` &&
      file !== target
    )
      report('internal imports must avoid their own barrel');
    if (to === 'shared' && sharedOwner(file) !== sharedOwner(target)) {
      const owner = sharedOwner(target);
      const serverEntry = target === 'src/shared/i18n/server.ts';
      if (target !== `${owner}/index.ts` && !serverEntry)
        report('import the shared segment/component public API');
    }
  };
  const visit = (node) => {
    if (ts.isExportDeclaration(node) && !node.exportClause)
      errors.push(`${file}: use explicit public exports instead of export *`);
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      check(node.moduleSpecifier.text, node);
    if (ts.isModuleDeclaration(node) && ts.isStringLiteral(node.name)) check(node.name.text, node);
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === 'require')) &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    )
      check(node.arguments[0].text, node);
    if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteral(node.argument.literal)
    )
      check(node.argument.literal.text, node);
    ts.forEachChild(node, visit);
  };
  visit(source);
}
for (const layer of ['pages', 'features', 'entities']) {
  for (const name of readdirSync(`src/${layer}`)) {
    if (!existsSync(`src/${layer}/${name}/index.ts`))
      errors.push(`Missing public API: ${layer}/${name}`);
  }
}
if (errors.length) {
  process.stderr.write(`${errors.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Architecture OK: ${files.length} TypeScript files, ${imports} local dependencies.\n`,
  );
}
