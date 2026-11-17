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
      onLoad: (code) =>
        code.replace(
          /const t = use([A-Z][A-Za-z0-9]*)Translation\(\)/g,
          (_, feature: string) => `const { t } = useTranslation('${feature.toLowerCase()}')`,
        ),
    },
  ],
});
