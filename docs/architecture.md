# Frontend architecture

The dashboard follows Feature-Sliced Design v2.1 with a pages-first approach.
Page-specific code stays together; lower layers hold responsibilities that already
have several consumers. The framework remains React/Vite with code-based TanStack
Router routes. This migration changes ownership and imports, not business behavior.

## Review and decisions

The source review covered all 170 files under `src` before migration and traced
591 static local imports/re-exports, plus routing, localization, build/test setup,
project documentation, and local skills. It found:

| Finding                                                                | Resolution                                                                           |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Route components and single-page behavior were classified as features  | Move them into page slices, including their dialogs, columns, utilities and catalogs |
| Business stores in Shared imported entity models and the parts feature | Move service, company and inventory stores to the owning entity's `model/`           |
| The order-workflow domain test imported cartable page logic            | Move the cross-layer integration test to `app/tests/`                                |
| Consumers imported private component/model/hook files                  | Introduce explicit public contracts and enforce their use                            |
| The global dashboard shell was modeled as a business feature           | Place shell composition, UI, hooks, navigation and catalog in App                    |
| Extraction assumed every business namespace lived in Features          | Derive catalog locations from colocated bundle declarations                          |

The downloaded upstream frontend architecture skill matched the existing local
copy. The local skill index explains how FSD specializes its general advice.
The official FSD skill is vendored in `.skills/fsd/`.

## Layers and ownership

```text
src/
  app/                     Router, initialization, global shell and integration tests
    ui/                    Header, sidebar, notifications and demo notice
    hooks/                 Shell interaction and translation hooks
    config/i18n/           Shell catalogs, namespace dashboard
    config/navigation.ts   Navigation definitions
    lib/                   Navigation helpers
    styles/                Tailwind entry and theme tokens
    routes/                Thin TanStack Router adapters
    tests/                 Cross-layer workflow/store integration tests
  pages/
    cartable/              Review, assignment, work, collection, settlement, archive
    customers/             Directory and order history
    dispatch/              Technician visit schedule
    finance/               Ledger, accounts, receivables, receipts and expenses
    overview/              Dashboard summary
    parts/                 Inventory, needs, procurement and allocation screens
    reports/               Operational and financial reports
    requests/              Search/filter/create entry screen
    settings/              Company and workflow settings screen
    technicians/           Management, specialties, assignments and balances
  features/
    requests/              Reused JobEditor, JobTable and ApplianceIcon
    finance/               Reused TransactionDialog and CashChart
  entities/
    service/               Orders, customers, technicians and transactions aggregate
      model/               Records, pure rules, seed data and service store
      ui/                  JobStatusBadge
      @x/inventory.ts      Type-only Appliance contract for inventory
    inventory/model/       Parts, reservations, purchases and inventory store
    company/model/         Settings, validation, defaults and company store
  shared/
    ui/<component>/        Component-sized public UI entry points
    lib/                   Dates, formatting, CSV, form and table helpers
    hooks/                 Common translation hook
    i18n/                  Generic catalogs, registration contracts and instances
    store/                 Generic theme preference
```

Dependency direction is `app -> pages -> features -> entities -> shared`.
Layers may skip levels. Different slices on the same layer cannot import each
other. App and Shared have segments, not slices. No empty Widgets layer is added.
`main.tsx` remains the Vite entry adapter.

The service aggregate intentionally keeps orders and their customers, technicians
and transactions together: validation and financial transitions operate atomically
over those records. Splitting them now would introduce circular domain references.
Inventory has independent stock/reservation rules and persistence. It shares only
the service appliance type through `entities/service/@x/inventory.ts`; this narrow,
type-only gateway is the sole entity cross-import. Company settings are independent.

Page slices use `ui/`, `model/` and `lib/` as needed. The user's existing `hooks/`
and `i18n/` segments remain deliberate project conventions. React hooks use `.tsx`.
Several related routes can share one page slice, such as the cartable queues and
technician screens; they do not import other page slices.

## Public contracts

External consumers import `@/pages/customers`, `@/features/requests`, or
`@/entities/service`, never their private files. Each slice has explicit exports
in `index.ts`; no wildcard exports. Inside a slice, import implementation files
directly rather than importing its own barrel.

Shared exports public segment APIs (`@/shared/lib`, `@/shared/hooks`,
`@/shared/store`, `@/shared/i18n`). UI uses component-sized APIs, for example
`@/shared/ui/button` and `@/shared/ui/data-table`. This avoids a library-wide UI
barrel that would pull the Jalali calendar into the initial graph. The existing
dynamic calendar import remains lazy.

`npm run architecture:check` uses the installed TypeScript parser to inspect
imports, re-exports, dynamic imports, require calls, type imports and module
augmentations. It rejects upward dependencies, lateral slice imports, private
cross-slice imports, missing entry points and unresolved local modules. It checks
tests too; integration tests belong in App. This focused guard avoids adding a
second dependency/toolchain solely for import boundaries. It is not a replacement
for design review or a complete Steiger implementation.

## State and persistence

Business stores live beside their entity models and expose the existing selector
hooks through the entity API. LocalStorage keys, serialized values, validation,
storage-failure behavior and financial guards are unchanged. Transient form,
filter, sorting, pagination and dialog state remains local. The theme preference
is infrastructure and stays in Shared.

## Translation ownership and loading

Each page/feature owns `i18n/{fa,en}.json`, its resource declaration and its typed
hook under `hooks/`. Requests and finance have distinct page namespaces
(`requests-page`, `finance-page`) and reusable feature namespaces (`requests`,
`finance`). Contextual copy can differ without depending on another slice's hook.
Compatibility labels register with their owning bundle; persisted Persian values
are unchanged. Generic messages remain in Shared; shell messages belong to App.

App composes bundles through public APIs. Registration stays static, matching the
existing eager route graph; no HTTP loading or extra i18n library is introduced.
The extractor discovers namespace destinations from resource declarations rather
than duplicating a directory registry. Namespace collision detection and locale
shape checks remain active.

The app is client-rendered. `shared/i18n/server.ts` is a browser-independent public
entry point for `createI18n(language, bundles)`, allowing isolated instances for
tests and any future server integration. Browser singleton initialization lives
separately in `instance.ts`. This does not add SSR to Vite or make the singleton
business stores request-scoped; a future SSR deployment must isolate those too.

## Sources

Migration verification includes the existing 42 regression tests, locale coverage
and placeholder lint, TypeScript, production build and formatting checks. The
import guard was also checked against an intentionally invalid upward/private
import. Comparing parsed source confirmed that all 13 model/store implementation
bodies were unchanged apart from imports. Browser rendering and keyboard behavior
were not reverified during this source migration. The existing build warning about
the main bundle exceeding 500 kB remains; route splitting is a separate decision.

- [Official FSD layers and pages-first guidance](https://fsd.how/docs/reference/layers/)
- [Official public API guidance](https://fsd.how/docs/reference/public-api/)
- [Official FSD skill](https://github.com/feature-sliced/skills/tree/master/feature-sliced-design)
- [Frontend architecture skill](https://github.com/we-are-singular/skills/tree/main/skills/frontend-architecture)
