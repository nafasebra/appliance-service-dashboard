import { defineConfig } from 'i18next-cli';

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
    output: (language, namespace) =>
      namespace === 'common'
        ? `src/shared/i18n/locales/${language}/common.json`
        : namespace === 'app'
          ? `src/app/i18n/${language}.json`
          : `src/features/${namespace}/i18n/${language}.json`,
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
            `const { ${binding === 't' ? 't' : 't: tShared'} } = useTranslation('${feature === 'Shared' ? 'common' : feature.toLowerCase()}')`,
        );
        const feature = filePath
          .replaceAll('\\', '/')
          .match(/(?:features\/([^/]+)|(app)|(shared))\/i18n\/legacy-labels\.ts$/);
        const namespace =
          feature?.[1] ?? (feature?.[2] ? 'app' : feature?.[3] ? 'common' : undefined);
        // Model errors and status labels are dynamic callers. Include their local
        // key mappings in extraction without adding runtime translation calls.
        const labels = namespace
          ? [...code.matchAll(/:\s*['"]([^'"]+)['"]/g)].map(([, key]) => `${namespace}:${key}`)
          : [];
        // Deferred feedback stores a qualified key and resolves it at render time.
        const deferred = [...code.matchAll(/['"]([a-z]+:[A-Za-z][A-Za-z0-9_.]*)['"]/g)].map(
          ([, key]) => key,
        );
        return (
          normalized +
          '\n' +
          [...labels, ...deferred].map((key) => `i18next.t('${key}');`).join('\n')
        );
      },
    },
  ],
});
