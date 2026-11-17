# Localization

The dashboard uses i18next and react-i18next with repository-managed JSON resources.
Persian (`fa`) is the default and fallback language; English (`en`) is selectable
from the header. No external translation service is required.

## Adding copy

- Add matching entries to `src/shared/i18n/locales/fa/translation.json` and
  `src/shared/i18n/locales/en/translation.json`. Use nested objects and descriptive,
  stable keys. Keep translated content in these files rather than inline fallbacks.
- Use `useTranslation()` in React components. Include `t` in memo dependencies
  when memoized columns or derived labels contain translations.
- Translate complete sentences with interpolation. Use i18next `_one` and `_other`
  keys with `count` for plurals; avoid concatenating sentence fragments.
- Render plain counts directly. Currency and dates use shared formatters; the
  language changes their presentation without changing currency or timezone.
- Keep customer names, addresses, descriptions, IDs, and saved business records
  unchanged. `legacy-labels.ts` maps existing predefined Persian labels and model
  validation messages at the presentation boundary. New copy should use keys directly.

## Direction and persistence

The language is persisted separately under `hamyar-service-language`. Initialization
defaults to Persian when storage is unavailable or unsupported. Language changes
update the document title, `lang`, `dir`, and the Radix direction provider. Use
logical Tailwind spacing and alignment; directional icons can use `rtl:`/`ltr:`.
The sidebar changes sides with the document direction.

The calendar remains **Jalali in both languages**. Dates are stored as ISO calendar
dates, with Tehran-aware display handling. English does not change financial rules,
convert toman, or migrate existing records.

## Verification

Run `npm run i18n:extract` after introducing keys, inspect the resource diff, and
complete both JSON catalogs. Extraction preserves dynamically resolved legacy
labels. Run `npm run i18n:check` and `npm test`; tests enforce matching nonempty
catalogs and interpolation variables, language persistence, direction changes,
pluralization, and preservation of business data. Review desktop/mobile layouts,
keyboard navigation, and both themes in each language when browser access is available.
