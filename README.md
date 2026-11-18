# Hamyar Service Dashboard

A Persian/English dashboard for a home appliance repair company. The company
dispatches technicians to customers’ homes, earns a commission, and tracks service
requests, parts, customer accounts, and cash flow.

This is an interactive frontend demo with sample data and browser-local persistence.
There is no backend, authentication, shared database, bank connection, or production
accounting integration.

## Getting started

Use **Node.js 22.18 or newer** for the complete development and test workflow.
The package engine range is `^20.19.0 || >=22.12.0`, but the tests use Node’s native
TypeScript transformation (`--experimental-transform-types`) to run string enums
directly, which is unavailable in Node 20.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. No environment variables or external services are
required. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Commands

| Command                | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Start the development server                              |
| `npm test`             | Run domain, store, date, CSV, chart-data, and table tests |
| `npm run typecheck`    | Check TypeScript projects                                 |
| `npm run format`       | Format project files with Prettier                        |
| `npm run format:check` | Check formatting without changing files                   |
| `npm run build`        | Type-check and build into `dist/`                         |
| `npm run preview`      | Preview the production build locally                      |

Run tests, formatting checks, type checks, and a build before handing off application
changes. Also check RTL layouts, both themes, keyboard navigation, dialogs, and date
inputs in the browser.

## Features

| Area                                                          | Routes                                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Operational overview                                          | `/`                                                                                  |
| Service requests and dispatch                                 | `/requests`, `/dispatch`                                                             |
| Customer directory and service history                        | `/customers`                                                                         |
| Technician management, specialties, assignments, and balances | `/technicians`, `/technician-specialties`, `/technician-jobs`, `/technician-finance` |
| Inventory, availability inquiries, purchasing, and allocation | `/parts`, `/part-needs`, `/part-purchases`, `/part-allocations`                      |
| Customer statements and receivables                           | `/customer-accounts`, `/receivables`                                                 |
| Receipts, expenses, transaction register, and CSV exports     | `/receipts`, `/expenses`, `/finance`                                                 |
| Performance and financial reports                             | `/reports`                                                                           |
| Company, branch, visit defaults, and theme settings           | `/settings`                                                                          |

## Technology

React 19, strict TypeScript, Vite, Tailwind CSS v4, local shadcn/ui components with
Radix primitives, TanStack Router, TanStack Table v9, and Zustand v5.

Jalali date selection uses React DayPicker and `date-fns-jalali`. The interface uses
locally bundled Vazirmatn fonts and Lucide icons. Prettier handles formatting, and
Node’s built-in test runner executes the tests. Exact dependency versions and
integrity information are recorded in `package-lock.json`.

## Architecture

```text
src/
  app/                    Entry point, routes, providers, and layout composition
  features/               Business pages and workflows
    dashboard/            Shell components, hooks, navigation, and shell translations
    customers/
    dispatch/
    finance/
    overview/
    parts/                Inventory model, workflows, and table-column hook
    reports/
    requests/
    settings/
    technicians/
  entities/
    company/model/        Company settings types, defaults, and validation
    service/model/        Records, financial rules, validation, and sample data
    service/ui/           Reusable service-domain presentation
  shared/
    components/           Reusable language and theme controls
    store/                Zustand stores and integration tests
    ui/                   Local shadcn primitives and shared DataTable
    lib/                  Formatting, dates, and class-name helpers
    utils/                Shared pure utilities
  styles/                 Tailwind entry, theme tokens, base rules, and utilities
```

The alias `@/` points to `src/`. The normal dependency direction is
`app → features → entities → shared`. A deliberate composition exception allows
`shared/store` to import pure entity and parts models. Those models remain
independent of stores to avoid circular dependencies.

Features own their workflows. Shared UI receives data and callbacks rather than
reading feature stores. Domain calculations stay outside React components.
Cross-feature reuse uses intentional entry points such as
`features/requests/job-components.ts`.

## Technical decisions

| Decision                                               | Rationale and consequence                                                                                                                                                                                 |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client-rendered React with Vite                        | Supports the current interactive dashboard and frontend-only scope. Backend technology and API contracts remain future decisions.                                                                         |
| Organize code by business feature                      | Keeps requests, finance, technicians, and parts close to their own workflows. Shared models hold rules used by multiple features.                                                                         |
| Typed, code-defined routing                            | Routes are explicit in `src/app/routes/` and registered in `src/app/router.ts`. Internal navigation uses TanStack `Link`; no route generator is required.                                                 |
| Zustand for shared state; React for temporary UI state | Records, inventory, company settings, and theme are shared across screens. Forms, filters, dialogs, and table state remain local. Stores separate state/actions and consumers use selectors.              |
| Explicit persistence with existing JSON formats        | Preserves localStorage keys and validates restored records. Operational changes remain available in memory if saving fails and expose an error; company settings apply only after successful persistence. |
| Locally owned shadcn components                        | Gives the project control over RTL behavior, accessibility, and styling. Components live in `src/shared/ui/`; additions use official source without running the shadcn CLI.                               |
| Tailwind v4 utilities and semantic tokens              | Layout classes stay on elements; theme values live in `src/styles/index.css`. Use `cn()` for conditional class merging and plain strings for static classes.                                              |
| A shared DataTable                                     | Centralizes markup, sorting controls, and pagination. Features own raw accessors and typed columns. Persian text uses locale-aware comparison; amounts remain numeric and dates remain ISO for sorting.   |
| Jalali presentation with ISO storage                   | Persian calendar inputs serve the interface while `YYYY-MM-DD` records keep validation, filtering, and sorting consistent. Date-only helpers avoid unintended timezone shifts.                            |
| Theme initialization before React mounts               | `index.html` sets `data-theme` from the saved choice or system preference. Zustand handles subsequent changes, and semantic tokens provide both palettes.                                                 |
| Pure financial rules with focused tests                | Keeps calculations consistent across customer accounts, technician balances, and reports. Validation protects recorded payments when requests are edited.                                                 |

Tables sort the filtered dataset before pagination. They default to 10 rows per page
and offer 10/20/50 rows with RTL first/previous/next/last controls. Data and sorting
changes return to page one. Action columns are not sortable. Sorting and pagination
operate on the loaded browser dataset; server-side processing is not implemented.

## Persistence and financial behavior

| localStorage key             | Data                                               |
| ---------------------------- | -------------------------------------------------- |
| `hamyar-service-demo-v1`     | Customers, technicians, requests, and transactions |
| `hamyar-parts-v1`            | Parts, needs, and purchases                        |
| `hamyar-company-settings-v1` | Company, branch, and visit defaults                |
| `hamyar-service-theme`       | Light/dark preference                              |

Data is local to the browser and origin. Clearing browser storage removes saved
changes. Invalid or incompatible data falls back to sample records or defaults.
This persistence is not a multi-user database or an authoritative financial ledger.

Current demo rules distinguish completing a service from collecting or paying money:

- Only completed requests contribute to service value and company commission.
- Commission is an explicit integer amount, not an automatic percentage.
- Completing a request does not create a customer receipt or technician payout.
- Technician payable is the completed service amount minus commission and recorded
  payouts for that request.
- Customer receivables are unpaid amounts on completed requests. Advances on open
  requests do not automatically offset other orders.
- Cash flow is actual receipts minus technician payouts and company expenses.
  There is no opening balance.
- Reservations reduce available stock. Delivery reduces physical stock; a healthy
  return restores it. Purchasing parts does not automatically create a financial
  transaction.

Statuses, amounts in toman, commission rules, and sample workflows describe demo
behavior. Production policies for refunds, reversals, settlements, roles,
permissions, and currency still need confirmation.

## Deployment and limitations

Build with `npm run build` and serve `dist/` from a static host. Configure the host
to rewrite application routes to `index.html` so direct links and refreshes work.
`npm run preview` is for local build inspection.

The application does not provide authentication, authorization, audit history,
transaction reversals, synchronization between users, or bank integration.
Browser validation cannot replace backend enforcement when real data is introduced.
The build currently reports a bundle-size warning; route-level code splitting
remains future work.

## Project guidance

- [AGENTS.md](AGENTS.md): coding conventions, architecture, and business scenario.
- [Project context](docs/project-context.md): requirements and demo behavior in Persian.
- [Codebase review](docs/codebase-review.md): source-review findings and limitations.
- [Project skills](.skills/README.md): local React, Tailwind, shadcn, architecture,
  Zustand, and TanStack Table guidance.

Source files use UTF-8, LF line endings, two-space indentation, and a final newline.
Prettier is the formatting authority. Preserve both languages, RTL/LTR behavior,
and both themes when extending the interface.

## Order workflow

Order workflow pages start at `/cartable` and are grouped in the sidebar:
incoming requests, assignment, active visits, customer collection, technician
settlement, and closed orders. The company collects customer payment before paying
the technician's share; partial receipts and payouts remain in their queue until
the balance is cleared. See [order workflow](docs/order-workflow.md) for routes,
transition rules, and payment behavior. These are local demo records; dispatching
does not send messages or create real-world payments.

## Localization

Persian and English are available from the header language selector, with automatic
RTL/LTR layout and a saved browser preference. Translations live in standard nested
JSON files managed with i18next/react-i18next. Each feature owns its messages under
`src/features/<feature>/i18n/{fa,en}.json` and exposes a typed hook such as
`useCustomersTranslation()`. Generic controls use `useSharedTranslation()` with
`src/shared/i18n/locales/{fa,en}/common.json`. Shell messages use
`useDashboardTranslation()` with `src/features/dashboard/i18n/{fa,en}.json`. The Jalali
calendar and existing business records are
preserved in both languages. See [localization conventions](docs/localization.md)
for adding messages and running extraction and validation.
