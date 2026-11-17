import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['fa', 'en'],
  extract: {
    input: 'src/**/*.{ts,tsx}',
    ignore: ['src/**/*.test.ts', 'src/shared/i18n/**', 'src/**/model/**', 'src/shared/store/**'],
    output: 'src/shared/i18n/locales/{{language}}/{{namespace}}.json',
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
});
