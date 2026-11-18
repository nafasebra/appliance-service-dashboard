# Localization

The dashboard uses i18next and react-i18next with repository-managed JSON resources.
Persian (`fa`) is the default and fallback language; English (`en`) is selectable
from the header. No external translation service is required.

## Analysis and ownership

The Vite application is client-rendered and uses i18next/react-i18next. Previously,
all messages lived in one `translation` namespace, including feature copy, and
`legacy-labels.ts` translated existing Persian labels at presentation boundaries.

| Feature     | Responsibility                                                  | Namespace     |
| ----------- | --------------------------------------------------------------- | ------------- |
| customers   | Directory, contact search, customer service history             | `customers`   |
| requests    | Request search, editor, job table                               | `requests`    |
| dispatch    | Technician schedules and assignment                             | `dispatch`    |
| technicians | Management, specialties, open jobs, balances                    | `technicians` |
| finance     | Cash ledger, customer accounts, receivables, receipts, expenses | `finance`     |
| parts       | Inventory, availability, procurement, allocations               | `parts`       |
| overview    | Dashboard summary                                               | `overview`    |
| reports     | Operational and financial reports                               | `reports`     |
| settings    | Company and workflow preferences                                | `settings`    |

The shared service entity owns records and pure accounting rules; its domain data
is not moved into feature catalogs. The app owns the shell, navigation, and resource
composition. Global controls, pagination, and formatting messages remain shared.
All nine features own their translations. Shared catalogs contain global controls,
navigation, appliance names, service/payment statuses, and validation messages used
across service workflows. Page-specific headings, forms, tables, and inventory
statuses live in their feature catalog.

## Directory structure

```text
src/
  app/i18n.ts                       Composes the feature bundle list
  features/customers/
    customers-page.tsx
    i18n/
      fa.json                       Persian business messages
      en.json                       English business messages
      resources.ts                  Bundle and local namespace type declaration
      use-customers-translation.ts  Namespace-bound hook
      translation.type-test.ts      Compile-time contract checks
  features/<other-feature>/i18n/     Same JSON, bundle and hook structure
    legacy-labels.ts                Only when existing model labels need a mapping
  shared/i18n/
    resources.ts                    Bundle contracts, resource builder, options
    create-i18n.ts                  Isolated instance factory
    i18next.d.ts                    Shared i18next type augmentation
    index.ts                       Existing browser singleton and compatibility API
    provider.tsx                   Provider accepting an explicit instance
    locales/{fa,en}/translation.json
```

## Registration and loading

Each feature exports one bundle containing its namespace and both locales. Add it
once to `translationBundles` in `app/i18n.ts`. Shared infrastructure receives bundles
as inputs and does not import features. `buildResources` rejects duplicate or invalid
namespaces before registration; `translation` is reserved by the shared bundle.
Use the feature directory name as its namespace. Identical leaf keys in different
namespaces are safe. Registration can run again during HMR without duplicating listeners.

Resources are statically imported, matching the current eager page imports. No HTTP
backend, runtime discovery, loading spinner, or extra i18n dependency is introduced.
The moved messages are removed from the shared catalog when no remaining consumers
need them. Feature catalogs add only their business copy and a small registration
wrapper. Consider route-level loading only if route splitting or measured bundle
growth justifies it.

## Hooks and type safety

```tsx
function CustomersPage() {
  const t = useCustomersTranslation();
  return <h1>{t('title')}</h1>;
}
```

The hook returns i18next's `TFunction<'customers'>` through `useTranslation`, so it
subscribes to provider language changes and supports normal interpolation, plurals,
and i18next formatting options. Keep JSX `const t = useCustomersTranslation()` calls
in this convention: the extraction plugin normalizes them for CLI analysis only.
The CLI derives the feature namespace from the hook name and writes to the feature
directory. PascalCase hook names correspond to lowercase feature names.
Use `const { t: tShared } = useTranslation()` for global controls alongside the
feature hook; keep feature copy on `t`. Non-React utilities can use an explicit
qualified key such as `i18next.t('parts:orders.idOrderUnavailable', { id })`.

Each feature augments `FeatureResources` locally with its canonical JSON type.
The shared `CustomTypeOptions` declaration combines it with the existing default
namespace. This gives key autocomplete and invalid-key errors without importing
feature resources into shared code. `strictKeyChecks` also rejects invalid keys
with default values. `LocaleShape` checks required locale structure; tests check
exact key parity, nonempty messages, and interpolation placeholders. JSON supports
key inference, but does not infer interpolation parameter names as string literals;
placeholder parity is verified at runtime in tests.

## Adding copy

- Put feature copy in that feature's `i18n/fa.json` and `i18n/en.json`. Use nested
  business concepts (`directory`, `search`, `history`) and descriptive, stable keys.
  Keep only genuinely global copy in `shared/i18n/locales`.
- Use the dedicated feature hook. Include `t` in memo dependencies
  when memoized columns or derived labels contain translations.
- Translate complete sentences with interpolation. Use i18next `_one` and `_other`
  keys with `count` for plurals; avoid concatenating sentence fragments.
- Render plain counts directly. Currency and dates use shared formatters; the
  language changes their presentation without changing currency or timezone.
- Keep customer names, addresses, descriptions, IDs, and saved business records
  unchanged. Feature-local `legacy-labels.ts` maps existing predefined Persian labels
  and model errors to typed local keys. The bundle registers these labels with an
  instance-specific lookup; shared infrastructure never imports feature code.
  The shared mapping contains global labels only. New copy should use keys directly.
- Store deferred validation messages as qualified keys (`requests:editor...`) and
  resolve them when rendering. The extractor preserves these keys and the dynamic
  model-label mappings through its analysis plugin.
- Shared UI receives translated props or uses shared translations for its own
  controls; it must not depend on a particular feature namespace. Reused request
  editors/tables still own their existing translations independently of customers.

## Server rendering boundary

There is no server entry or hydration workflow today. `createI18n(language, bundles)`
provides a browser-independent instance with cloned resources for each request.
Pass it to `LocalizationProvider instance={instance}`; never change the browser
singleton's language to serve a request. Server-render tests use the real provider
and feature hook to verify independent language and resource state.

A future server entry must choose the request locale and emit the matching document
direction and locale before hydration. It must pass the same locale/resources to
the client and adapt existing browser-singleton formatting/legacy helpers and
browser-local stores before claiming full-dashboard SSR support. This reference
proves the feature infrastructure's server isolation, not SSR for the whole app.

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
catalogs and interpolation variables in every bundle, typed feature hook namespaces,
instance-specific label mappings, language persistence, direction changes,
pluralization, and preservation of business data. Review desktop/mobile layouts,
keyboard navigation, and both themes in each language when browser access is available.
