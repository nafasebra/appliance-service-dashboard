import { defineConfig } from 'i18next-cli';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// Derive extraction destinations from the same colocated bundle declarations
// used at runtime. Moving a slice must not send its messages back to features/.
const catalogDirectories = [
  'src/shared/i18n',
  'src/app/config/i18n',
  ...['features', 'pages'].flatMap((layer) =>
    readdirSync(`src/${layer}`).map((slice) => `src/${layer}/${slice}/i18n`),
  ),
];
const catalogNamespaces = new Map<string, string>();
const catalogPaths = new Map<string, string>([['common', 'src/shared/i18n']]);
for (const directory of catalogDirectories.filter((value) => value !== 'src/shared/i18n')) {
  const source = readFileSync(`${directory}/resources.ts`, 'utf8');
  const namespace = source.match(/namespace:\s*['"]([^'"]+)['"]/)?.[1];
  if (!namespace || catalogPaths.has(namespace)) {
    throw new Error(`Missing or duplicate translation namespace: ${directory}`);
  }
  catalogPaths.set(namespace, directory);
}
for (const [namespace, directory] of catalogPaths) {
  catalogNamespaces.set(resolve(directory), namespace);
}

export default defineConfig({
  locales: ['fa', 'en'],
  extract: {
    input: 'src/**/*.{ts,tsx}',
    ignore: [
      'src/**/*.test.ts',
      'src/**/*.type-test.ts',
      'src/**/*.d.ts',
      'src/**/model/**',
      'src/shared/store/**',
    ],
    output: (language, namespace) => {
      const directory = catalogPaths.get(namespace);
      if (!directory) throw new Error(`Unregistered translation namespace: ${namespace}`);
      return namespace === 'common'
        ? `${directory}/locales/${language}/common.json`
        : `${directory}/${language}.json`;
    },
    primaryLanguage: 'fa',
    defaultNS: 'common',
    functions: ['t', '*.t', 'tShared'],
    preservePatterns: ['appTitle'],
    acceptedTags: 'all',
    instrumentScorer: (content) => (/[\u0600-\u06ff]/.test(content) ? 1 : null),
    acceptedAttributes: [
      'title',
      'description',
      'subtitle',
      'placeholder',
      'aria-label',
      'text',
      'alt',
      'label',
      'emptyMessage',
    ],
  },
  status: {
    ignoreKeys: ['languages.english', 'languages.persian'],
  },
  plugins: [
    {
      name: 'feature-translation-hooks',
      // Normalize the documented hook convention only for CLI analysis, not source.
      onLoad: (code, filePath) => {
        const normalized = code.replace(
          /const (t|tShared) = use([A-Z][A-Za-z0-9]*)Translation\(\)/g,
          (_, binding: string, feature: string) =>
            `const { ${binding === 't' ? 't' : 't: tShared'} } = useTranslation('${feature === 'Shared' ? 'common' : feature.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}')`,
        );
        const namespace = filePath.replaceAll('\\', '/').endsWith('/legacy-labels.ts')
          ? catalogNamespaces.get(resolve(dirname(filePath)))
          : undefined;
        // Model errors and status labels are dynamic callers. Include their local
        // key mappings in extraction without adding runtime translation calls.
        const labels = namespace
          ? [...code.matchAll(/:\s*['"]([^'"]+)['"]/g)].map(([, key]) => `${namespace}:${key}`)
          : [];
        // Deferred feedback stores a qualified key and resolves it at render time.
        const deferred = [...code.matchAll(/['"]([a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_.]*)['"]/g)]
          .map(([, key]) => key)
          .filter((key) => catalogPaths.has(key.split(':')[0]));
        return (
          normalized +
          '\n' +
          [...labels, ...deferred].map((key) => `i18next.t('${key}');`).join('\n')
        );
      },
    },
  ],
});
