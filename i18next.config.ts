import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['fa', 'en'],
  extract: {
    input: 'src/**/*.{ts,tsx}',
    ignore: [
      'src/**/*.test.ts',
      'src/**/*.type-test.ts',
      'src/shared/i18n/**',
      'src/**/model/**',
      'src/shared/store/**',
    ],
    output: (language, namespace) =>
      namespace === 'translation'
        ? `src/shared/i18n/locales/${language}/translation.json`
        : `src/features/${namespace}/i18n/${language}.json`,
    primaryLanguage: 'fa',
    defaultNS: 'translation',
    functions: ['t', '*.t', 'tShared'],
    preservePatterns: ['labels.*', 'ui.*', 'appTitle'],
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
          /const t = use([A-Z][A-Za-z0-9]*)Translation\(\)/g,
          (_, feature: string) => `const { t } = useTranslation('${feature.toLowerCase()}')`,
        );
        const feature = filePath
          .replaceAll('\\', '/')
          .match(/features\/([^/]+)\/i18n\/legacy-labels\.ts$/)?.[1];
        // Model errors and status labels are dynamic callers. Include their local
        // key mappings in extraction without adding runtime translation calls.
        const labels = feature
          ? [...code.matchAll(/:\s*['"]([^'"]+)['"]/g)].map(([, key]) => `${feature}:${key}`)
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
