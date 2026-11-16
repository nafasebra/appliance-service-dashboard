# Project instructions

## Scope and source of truth

These instructions apply to this project and its descendants. Read this file and
`docs/project-context.md` before changing the project. Keep both up to date when the
user confirms requirements or changes an architectural decision.

The current phase is scaffolding only. Do not implement business features until
requested. The architecture below guides future work; it does not mean the modules,
API, or backend already exist. User instructions take precedence over this file.

## Business scenario

- The company provides household appliance repair services.
- The company sends technicians to customers' homes.
- The company earns a commission from the services performed.
- The dashboard will support managing that operation and viewing company cash flow.
- The user will define detailed features and workflows in later requests.
- The interface is Persian and right-to-left by default.

The expected high-level scenario is a service request, technician dispatch, work at
the customer's home, and recording the associated financial activity. Exact order
statuses, assignment rules, commission calculation, collection responsibilities,
refunds, settlements, and reporting definitions remain undecided. Do not invent
them or treat example values as confirmed requirements.

## Frontend architecture

Use React, TypeScript in strict mode, Vite, and Tailwind CSS. Use the existing `@/`
alias for imports from `src`. Add dependencies only when a concrete requirement
justifies them.

Organize by business feature as features are introduced:

```text
src/
  app/                   Application entry, providers, routing, and page composition
  features/
    <feature>/
      components/        Feature-specific UI
      hooks/             Feature-specific React behavior
      api/               Feature API adapters and transport mapping
      model/             Domain types, validation, and pure business rules
  shared/
    ui/                  Reusable, business-independent UI primitives
    lib/                 Small, genuinely shared utilities
    api/                 Shared transport configuration and error handling
  styles/                Tailwind entry, global styles, and design tokens
```

Create directories when they contain real code. Do not generate empty modules or
speculative abstractions. Future feature candidates include service requests,
technicians, dispatch, and finance; their boundaries may evolve with requirements.

Dependency direction is `app -> features -> shared`. Shared code must not import
features or application composition. Avoid reaching into another feature's internals;
expose an intentional public entry point when cross-feature use becomes necessary.
Keep transport, business calculations, and rendering separate.

Routing uses TanStack Router with code-based routes. Define page routes in
`src/app/routes/` and register them in `src/app/router.ts`. The root route owns the
shared layout and not-found fallback; `App.tsx` mounts `RouterProvider`. Use typed
`Link` and router navigation for internal URLs. Keep feature business logic outside
route definitions. New routes do not require a generator or a Vite router plugin.

Keep transient UI state local. Introduce shared state or server-state
caching only when the implemented workflows need it. Keep derived values derived
instead of synchronizing duplicate state with effects.

## System design

Currently the application is a client-only scaffold with a placeholder page. There
is no backend, authentication, database, or operational financial system. Backend
technology, deployment, API contracts, currency, and calendar are undecided.

For future integration, use the following boundary:

```text
Persian RTL UI -> feature hooks/use cases -> API adapters -> backend -> database
```

- Keep network access in API adapters, outside presentation components. Validate
  external data at the boundary and map it to explicit domain types.
- Keep credentials and secrets out of frontend code and `VITE_*` environment variables.
- Enforce authorization and authoritative financial calculations on the backend
  when one is implemented. UI visibility alone is not an access-control boundary.
- Treat customers, service requests, technicians, assignments, commissions,
  payments, and settlements as candidate concepts, not an approved database schema.
- Distinguish service value, company commission, technician payable, actual cash
  received, and actual cash paid. Never label total service value as company revenue
  or count receivables as cash flow without an agreed reporting definition.
- Once currency and rounding rules are confirmed, use integer minor units or an
  agreed decimal representation for money; avoid floating-point financial arithmetic.
- Plan persisted financial changes around backend transactions, audit history, and
  duplicate-request protection. Define cancellation and reversal rules before
  implementing financial edits.
- Define loading, empty, error, and success behavior with each data-backed feature.
  Keep demo data clearly identified and isolated from real API adapters.

## Clean code and UI conventions

- Prefer small, cohesive functions and components with descriptive names.
- Use explicit domain types; avoid `any`, unexplained type assertions, and redundant state.
- Extract repeated logic when it has a real shared purpose. Avoid generic frameworks
  for a single use case, unexplained constants, dead code, and commented-out code.
- Keep domain calculations pure and independent of React and browser APIs.
- Use named exports for reusable modules; the existing app entry may use a default export.
- Name React components in PascalCase and hooks with a `use` prefix. Follow existing
  local file naming conventions consistently within each feature.
- Write comments to explain intent, constraints, or tradeoffs rather than restating code.
- Use semantic HTML, associated form labels, keyboard access, visible focus states,
  and accessible names for icon-only controls when adding UI.
- Preserve Persian copy and RTL layout. Prefer logical spacing utilities such as
  `ms-*`, `me-*`, `ps-*`, and `pe-*` where direction matters. Handle LTR identifiers
  explicitly. Do not assume a currency, timezone, or calendar from display language.
- Use the locally bundled Vazirmatn font as the primary interface typeface. Keep
  Tahoma and Arial as fallbacks and load only the font weights the interface uses.
- Maintain both light and dark themes. Theme changes use `data-theme` on the root
  element, persist locally, and must preserve readable contrast and visible focus.
- Use Tailwind utilities and shared design tokens. Introduce reusable UI primitives
  when a pattern is reused, and keep feature-specific behavior inside its feature.

## Formatting and newlines

Prettier is the formatting authority. Use `.prettierrc.json`, `.prettierignore`, and
`.editorconfig`; do not hand-format around them.

- UTF-8 source files, LF line endings, two-space indentation, and a final newline.
- Use blank lines to separate logical sections; let Prettier normalize their layout.
- Run `npm run format` after edits and `npm run format:check` before delivery.
- Do not manually format generated output, dependency directories, or the npm lockfile.
  npm owns the lockfile; commit its updates when dependencies change.

## Verification and handoff

Run these checks after relevant changes:

```sh
npm run format
npm run format:check
npm run typecheck
npm run build
```

In Windows PowerShell environments that block `npm.ps1`, use `npm.cmd` instead.
Use meaningful tests when business behavior is introduced, especially commission,
rounding, settlement, and workflow rules. Do not add tests that only restate static
markup or scaffold configuration. Report what changed, checks performed, and any
remaining limitations. Record confirmed scenario and design changes in the docs.
