# Project Context and Scope

## Typography and table spacing

Font sizes and weights come from the standard Tailwind v4 variables in
`app/styles/index.css`. Custom sizes from 8 to 11 pixels have been removed. Main
text is 16 pixels, controls and tables use 14 pixels, and supporting text uses 12
pixels. Vazirmatn is used for Persian; Open Sans is used for English. Locally
bundled font weights 400, 500, 600, and 700 are used. Table row spacing is applied
to cells in the shared Table component. The meanings and roles of the type scale
are documented in `docs/design-system.md`.

## Application shell

Shell components, the sidebar hook, menu configuration, and shell translations live in `app/ui/`, `app/hooks/`, and `app/config/i18n/`. Language and theme controls in `shared/ui/` are reusable. The `app` layer owns the entry point, routing, providers, global shell, and layout composition.

The dashboard footer has been removed. The sidebar guide text and button use semantic color tokens so they remain readable in dark mode.

Sidebar behavior: on desktop it toggles between full and icon-only modes; on tablet it is always icon-only; on mobile it toggles between hidden and a full modal drawer. The header toggle is active on desktop and mobile. See `docs/design-system.md` for details.

## Order cartable

Order status is defined by `JobStatus`, order account status by `PaymentStatus`, and part need and purchase statuses by `NeedStatus` and `PurchaseStatus`. All enums use string values, and previously stored values remain unchanged. Project hooks use the `.tsx` extension by convention. Tests use `tsx --tsconfig tsconfig.app.json --test` to run TypeScript and these hooks.

Six pages have been added in a separate menu group: incoming requests (`/cartable`), assignment, visits and repairs, customer collection, technician settlement, and archive. The `accepted` status sits between a new request and dispatch. Assignment includes a technician and a Jalali date and time. Completing a repair finalizes the service amount and commission and does not create a transaction automatically.

By user decision, the company collects payment from the customer and then pays the technician's share after deducting the commission. New technician payouts in all financial workflows require full collection for that order. Partial receipts and payouts are recorded; an order remains in financial follow-up until both balances reach zero. Existing data is preserved. See `docs/order-workflow.md` for details.

## Shared tables

Shared browser-side pagination supports 10, 20, and 50 rows, with 10 as the default. First, previous, next, and last page controls follow right-to-left direction. Sorting applies to the entire filtered dataset before pagination. Data or sorting changes return to the first page. An empty table has zero pages and disabled navigation controls.

The official skills matching installed TanStack Table version 9.3.1 are in `.skills/tanstack-table/`. The shared column type is `DataTableColumn<T>`; TanStack feature details remain inside the shared layer. Parts columns live in a separate hook, and dependent callbacks are stable. Order status in tables and the dispatch schedule is shown by `entities/service/ui/job-status-badge.tsx`. Restored-data validation also rejects receipts above the order amount, receipts for cancelled or unpriced orders, and invalid payment method or part status types.

All tables use `src/shared/ui/data-table.tsx`, which combines the locally owned shadcn Table with TanStack Table v9. Data columns cycle between ascending, descending, and original order through clicks or keyboard input; action columns are not sortable. Text sorts with Persian collation, amounts and counts as raw numbers, and dates by ISO value. Column definitions and derived data are memoized in their owning feature, and sorting state remains local.

## Shared application state

Translation hooks for each page or feature live in that slice's `hooks/` directory. The generic translation hook lives in `shared/hooks/`. Translation JSON files and resource registration remain in `i18n/`.

The shared translation catalog contains only generic controls in `shared/i18n/locales/{fa,en}/common.json`, and its hook is `useSharedTranslation`. Shell text lives in `app/config/i18n/` and uses `useDashboardTranslation`. Appliance names, order statuses, and feature-specific errors belong to their owning feature. Shared display uses registered bundle mappings without depending on features.

Zustand guidance is in `.skills/zustand/SKILL.md`. State and actions have separate types, and stores use `subscribeWithSelector`. Action inputs are isolated from form references. Parts operations run on a copy so a validation failure cannot mutate current state. Explicit persistence preserves old formats and the distinct error behavior for settings and operational data.

Business stores live in `entities/service/model/service-store.ts`, `entities/inventory/model/inventory-store.ts`, and `entities/company/model/company-store.ts`. Only the theme preference remains in `shared/store/theme-store.ts`. Shared no longer depends on business models or features. Consumers select only the fields they need, and existing localStorage keys are preserved. Forms, filters, and row selection remain local. Sidebar context handles interactions within the sidebar.

## Customer accounts and financial ledger

Pages `/customer-accounts`, `/receivables`, `/receipts`, and `/expenses` cover customer statements, receivables, incoming payments, and company expenses. `/finance` is the shared transaction ledger.

Receivables are calculated only from completed service amounts minus receipts for the same order. Deposits for open orders and credits against one order are not automatically offset against debt on another order. Optional payment method and document reference are stored with transactions; older records without these fields remain valid.

The shared store validates financial entries. Duplicate IDs, invalid amounts or dates, receipts above an order's amount, and payouts above the technician's entitlement are rejected. An order with a receipt cannot be cancelled, moved to another customer, or reduced below the amount already received without a financial adjustment.

Refunds, adjustments and voids, technician-collected payments, opening balances, and bank integration are not implemented. This is a local operational ledger, not formal accounting software or a multi-user system.

## Company settings

The `/settings` page provides company and branch details, default hours and priority for new orders, and theme selection. The company name and brand appear in the sidebar, and the branch name appears in the header.

Company settings are stored separately with validation under `hamyar-company-settings-v1`; the theme uses its own store. Restoring defaults changes only the settings form and requires saving to take effect. Existing orders and transactions are not changed.

## Domain boundaries

The project follows Feature-Sliced Design v2.1 with a pages-first approach. Pages and page-specific logic live in `src/pages/`; reusable request editors and tables, and financial controls, live in `src/features/`. The parts model and store live in `entities/inventory`. Dependencies flow in this direction: `app -> pages -> features -> entities -> shared`.

External consumers use each slice's `index.ts` and do not import private files. The only cross-entity type reference is Appliance through `service/@x/inventory.ts`. Architecture decisions and review details are in `docs/architecture.md`, and the automated check runs with `npm run architecture:check`.

## Technician and parts management

Four technician pages are in a separate menu group: management (`/technicians`), specialties (`/technician-specialties`), assigned open orders (`/technician-jobs`), and finance (`/technician-finance`). Technician details and specialty names are stored in the demo store. Financial accounts are calculated from completed services and existing transactions; a new payout cannot exceed the balance for its order.

Four parts pages cover inventory, order needs and availability inquiries, procurement requests and purchasing, and allocation and delivery. Parts are categorized by appliance type, code, and compatible model. A part request is linked to a customer order. Reservations reduce allocatable stock; delivery reduces physical stock, and a good-condition return increases it. Procurement is tracked from request through approval and purchase order to partial or complete receipt.

Parts data is stored separately from operational data under `hamyar-parts-v1` and validated on load. A parts purchase does not automatically create a financial transaction. Defective returns and parts pricing are not implemented.

## Confirmed scenario

- The product is a Persian, right-to-left dashboard for a home appliance repair service company.
- The company dispatches technicians to customers' homes and earns commission on completed services.
- The financial area must show receipts, technician payouts, expenses, and cash flow.
- The stack is React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Router, and shadcn/ui.
- The interface uses Vazirmatn for Persian and Open Sans for English, and supports
  light and dark themes.

## Current state

This is an interactive, frontend-only demo. Connected pages cover the overview, requests, dispatch, technicians, customers, finance, and reports. Sample data is held in Zustand and stored in localStorage under `hamyar-service-demo-v1`.

There is no backend, authentication, database, bank connection, or real accounting integration. Amounts, sample dates, statuses, and financial rules currently represent implemented demo behavior only.

## Technical decisions

- Routes are defined in `src/app/routes/` and registered in `src/app/router.ts`.
- Layer dependencies follow `app -> features -> entities -> shared`, and pure financial logic belongs in models.
- Locally owned shadcn/ui components live in `src/shared/ui/`. The shadcn CLI is not used.
- Tailwind v4 uses the Vite plugin and CSS-first configuration. Utilities are placed directly on JSX elements, `cn()` merges conditional classes, and semantic tokens are defined in `src/app/styles/index.css`.
- Global CSS is limited to theme tokens, fonts, and base rules. There is no central recipe dictionary.
- The theme uses `data-theme` and is stored under `hamyar-service-theme`.
- localStorage data is validated before use, including records, references, and financial rules. Corrupted or incompatible data is discarded and valid sample data is loaded.

## Current demo financial rules

- Statuses are `new`, `scheduled`, `working`, `completed`, and `cancelled`.
- Commission is an explicit integer amount, not a calculated percentage.
- Only completed services count toward service value and commission.
- Receipts and payouts are separate transactions. Completing a service does not automatically create a receipt.
- Technician balance equals service value minus commission and payouts for the same order.
- Cash flow equals receipts minus payouts and expenses, with no opening balance.
- After a transaction is recorded for a completed service, changing its status to a non-completed status is blocked. After a technician payout, changing the technician or reducing their share below the recorded payout is also blocked.

## Open decisions

Roles and permissions, the final order and dispatch workflow, the commission formula, who collects payment, transaction voids and refunds, technician settlement, final currency, API contract, and production data model still require confirmation. Demo choices do not become production requirements without approval.

## Interface language

All feature translations follow the customers pattern and live in each feature's `i18n/` directory: `fa.json`, `en.json`, a separate namespace, and a dedicated typed hook. Bundles are registered in `app/i18n.ts`; shared infrastructure does not depend on features. Only generic controls, menus, appliance names, and shared domain messages remain in Shared. Feature-specific model errors and statuses are registered in the owning feature's bundle so stored data and business logic remain unchanged. Key consistency is checked across all bundles. An independent factory exists for potential SSR use; the dashboard itself remains client-only.

The interface supports Persian RTL and English LTR, with English as the default. Translations are maintained in repository JSON files using i18next and react-i18next, with no external service. The language choice is stored under `hamyar-service-language`. The calendar remains Jalali in both languages. Changing the display language does not change customer data, orders, or financial calculations. See `docs/localization.md` for translation maintenance.
