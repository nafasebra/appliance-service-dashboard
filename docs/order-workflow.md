# Order cartable

The company reviews a customer request, accepts it, assigns a technician and visit,
tracks the repair, collects the customer payment, and pays the technician after
keeping its commission. These are administrative workflows in the browser-local
demo. The existing request editor provides intake; there is no customer portal,
technician messaging integration, backend authorization, or bank transfer.

## Queues

| Route                  | Queue                 | Eligibility and action                                                           |
| ---------------------- | --------------------- | -------------------------------------------------------------------------------- |
| `/cartable`            | Incoming requests     | `new`: inspect details, accept or cancel                                         |
| `/cartable/assignment` | Awaiting assignment   | `accepted`: choose technician, Jalali visit date and time                        |
| `/cartable/active`     | Visits and repairs    | `scheduled`: start; `working`: finalize service total and commission             |
| `/cartable/collection` | Customer payment      | Completed job with outstanding customer balance: record receipts                 |
| `/cartable/settlement` | Technician settlement | Completed job, fully collected, remaining technician entitlement: record payouts |
| `/cartable/archive`    | Closed requests       | Cancelled, or completed with zero customer and technician balances               |

Each order belongs to exactly one queue. Queue counts and rows derive from shared
orders and transactions; no separate queue store or duplicate financial status is
persisted. Partial receipts keep an order in collection. Partial technician payouts
keep it in settlement. A zero technician share needs no payout transaction.

## Service transitions

The cartable follows `new -> accepted -> scheduled -> working -> completed`.
Cancellation is available before completion, subject to existing receipt guards.
Assignment requires an existing technician and a valid date/time. Completion
requires a positive integer total and an integer commission between zero and total.
Technician compatibility and capacity remain operator decisions; free-text
specialties are displayed alongside the technician's service area.

`applyJobWorkflow` checks the latest stored status against the action's expected
status, validates the transition and existing financial guards, and validates the
entire candidate dataset before committing it. Repeated or stale actions fail
without writing storage. The general request editor remains available for manual
record maintenance; the cartable's action buttons enforce the staged flow.
Existing records remain readable; `accepted` is an additive status.

## Payments

The company collects the full completed-service amount from the customer. Its
commission is the explicit amount recorded on the order. Technician entitlement is
`service total - commission - existing payouts for the same order`. Company cash
flow still reflects actual receipts minus payouts and expenses.

Completing a repair creates neither a receipt nor a payout. Each is recorded
separately with amount, date, payment method, description, and an optional document
reference. Existing validation prevents duplicate IDs, overcollection and payouts
above entitlement. New payouts across all finance entry points also require full
customer collection. Earlier demo records are preserved; this new-action rule does
not discard historical datasets containing payouts before full collection.

The archive is a derived queue, separate from service completion. A completed job
with a balance stays in financial follow-up. Refunds, transaction reversal,
immutable audit history, and reopening closed requests remain outside this change.

## Interface and verification

The six pages are grouped separately in the sidebar. They reuse the shared TanStack
DataTable (sorting/pagination), local shadcn controls, Jalali date/time inputs, dark
theme, and feature-local Persian/English translations. Model and store tests cover
the lifecycle, partial payments, queue movement, financial guards, invalid input,
duplicate/stale actions and persistence. Browser interaction verification depends
on the available browser host.
