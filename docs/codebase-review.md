# Codebase review — 2026-11-17

## Coverage and standards

The source scan covered 94 TypeScript files, including tests. Focused manual review
covered table consumers in all 12 feature files, the shared table renderer, stores,
financial and inventory validation, routing, the shell, date inputs, and shared UI.
Guidance came from the local React, architecture, Tailwind, shadcn, Zustand, and
official TanStack Table 9.3.1 skills. This is a source review, not a production
security audit or complete browser workflow certification.

## Findings resolved

- Persisted receipts bypassed the cap enforced for new receipts. Hydration now
  rejects overpayment and receipts on cancelled or unpriced orders. Payment
  methods and inventory statuses require strings instead of accepting coercible
  arrays. Regression tests cover these storage-boundary cases.
- Feature files repeated TanStack feature generics and plain accessor renderers.
  The shared `DataTableColumn<T>` contract hides feature registration details;
  redundant renderers were removed across table consumers.
- Parts columns dominated the page and depended on callbacks recreated on each
  render. `usePartsColumns` now owns the three schemas, uses v9 column helpers to
  preserve value types, and renders cached accessor values. Workflow callbacks are
  stable; missing need records produce an error instead of a null assertion crash.
- Request and dispatch badges repeated the same status presentation. The shared
  entity component now owns these labels and semantic colors.
- Sixteen repeated Tailwind tokens and a conflicting heading margin were removed.
  Dashboard horizontal padding now uses the intended desktop/mobile prefixes.

## Verification and remaining limits

The refactor preserves storage keys, record shapes, client sorting, Persian RTL,
and the existing financial and inventory workflows. There is no backend or added
middleware. Tests, TypeScript, Prettier, and a production build are the verification
baseline. Browser click, keyboard, mobile, and visual checks were not rerun for this
review. The existing bundle-size warning remains; route splitting is separate work.
Parts forms still live in their page and may be extracted when those workflows
change; no speculative form framework was introduced.
