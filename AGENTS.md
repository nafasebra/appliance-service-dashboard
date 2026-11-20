# Project instructions

## Scope and references

This is a browser-local frontend demo for a home appliance repair company.
The company dispatches technicians, collects customer payments, retains commission
and pays technicians. English LTR is the default; Persian RTL is supported.
Production policies and backend contracts remain undecided.

Read `docs/project-context.md` before implementation. Consult these references
when the corresponding behavior changes, and update the owning document when a
confirmed requirement or architectural decision changes:

- Architecture, placement or imports: `docs/architecture.md`.
- Orders, assignment, collection or settlement: `docs/order-workflow.md`.
- Messages, translation hooks, namespaces or direction: `docs/localization.md`.
- New UI, typography, spacing or component reviews: `.skills/design-system/SKILL.md`.
- Relevant implementation guidance: `.skills/README.md`; load only the applicable
  skill and its needed references.

User instructions and the project constraints below take precedence over upstream
skill examples. Keep scenario details in the context/workflow documents rather
than duplicating them here.

## Architecture

Follow FSD v2.1, pages first: `app -> pages -> features -> entities -> shared`.

- Keep route-specific behavior in its page slice. Extract responsibilities only
  when they are actually reused and have a coherent boundary.
- App owns routes, initialization, the global shell and cross-layer integration
  tests. Business models and stores belong to Entities; Shared owns generic code
  and the theme preference.
- Consume another slice through its explicit `index.ts` API. Within a slice,
  import implementation files directly. Shared UI uses component-sized APIs;
  other Shared segments use segment APIs.
- Keep dependencies downward and sibling slices independent. Inventory's type-only
  `entities/service/@x/inventory.ts` contract is the documented entity exception.
- Preserve the user's `hooks/` and `i18n/` segments. All React hook files use `.tsx`,
  including hooks without JSX.
- Use TanStack Router's typed `Link` and navigation for internal URLs. Route
  definitions compose pages; business logic stays outside route adapters.

## Data and financial invariants

- Preserve string enum values, localStorage keys and serialized record formats.
  Validate stored records and references before accepting them.
- Completing a job does not create a receipt or payout. New technician payouts
  require full collection of the completed order. Existing transactions constrain
  later job edits; retain those financial guards.
- Keep service value, commission, technician payable, receivables and actual cash
  flow distinct. Read the workflow document before changing their calculations.
- Keep domain calculations pure. Business stores expose selector subscriptions;
  transient forms, filters and dialogs stay local, and derived state stays derived.
- Preserve storage-failure feedback, action input isolation and reset confirmation.
  Demo changes must not imply real dispatch, notifications or bank payments.
- Keep credentials out of frontend code. Future API integration must enforce
  authorization, validation and financial consistency on the backend.

## UI and localization

- Use the existing React/Vite/strict TypeScript stack, Tailwind v4 and locally
  owned shadcn components. Obtain additional component source from the official
  website/registry; do not run the shadcn CLI.
- Put complete Tailwind utilities directly on elements, using standard utilities
  and semantic tokens. Use `cn()` when classes need merging or conditions, rather
  than for every static class string; reserve `cva` for real component variants.
  Global CSS owns tokens, base rules and shared utilities.
- Preserve Vazirmatn, both themes, RTL/LTR behavior, logical spacing, keyboard
  access and accessible labels. Jalali calendars remain Jalali in both languages;
  records store ISO calendar dates. Display language does not change currency.
- The dashboard has no footer. Keep the removed sidebar copy `فضای آزمایشی شما`
  absent and the guide control readable in dark mode.
- Keep messages in the owning page/feature's `i18n/` and typed hooks in `hooks/`.
  Shell messages belong to App; only generic messages belong to Shared. Compose
  bundles in App through public APIs and preserve stored business text.
- Use the shared `DataTable` public API with TanStack Table v9. Keep numeric/date
  accessors raw, action columns unsortable, stable row IDs and memoized columns.
  Shared processing sorts before pagination; preserve existing page reset behavior.

## Verification

Use Prettier and `.editorconfig`: UTF-8, LF, two spaces and a final newline.
For application changes, run the existing scripts:

```sh
npm run format
npm run format:check
npm run architecture:check
npm run typecheck
npm test
npm run i18n:check
npm run build
```

Use `npm.cmd` when PowerShell blocks `npm.ps1`. Run `i18n:extract` when adding or
moving keys, then inspect both locale catalogs. Documentation-only work needs
formatting and reference checks rather than an application rebuild; vendored
upstream skill files are intentionally excluded from the normal formatting glob.

Use meaningful tests for changed behavior. Verify affected layouts, languages,
themes and keyboard interactions when browser access is available. Report actual
checks and limitations; a successful build alone does not verify browser behavior.
