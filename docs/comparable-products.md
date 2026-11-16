# Comparable field-service products

Research date: 2026-11-16. This is a focused review of four relevant products, not
an exhaustive review of every available product. Sources are official product pages;
no authenticated product trial was performed.

| Product                                                                             | Relevant published capabilities                                                    | Application to this dashboard                                                |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Jobber](https://www.getjobber.com/industries/appliance-repair-software/)           | Appliance-repair CRM, quotes, scheduling, invoicing, and communication             | Keep customer, appliance, visit, and financial context connected             |
| [Housecall Pro](https://www.housecallpro.com/industries/appliance-repair-software/) | Technician availability, scheduling, job progress, invoice lists, and payments     | Provide searchable requests, clear status, assignments, and payment records  |
| [ServiceTitan](https://www.servicetitan.com/features)                               | Dispatch, equipment/customer history, commission tracking, reporting, and payables | Separate operational reporting, commission, cash, and technician obligations |
| [Zoho FSM](https://www.zoho.com/fsm/schedule-and-dispatch.html)                     | Dispatch console, agent schedules, Gantt/grid views, and progress visibility       | Show visits grouped by technician with explicit dates and appointment times  |

## First implementation

The selected information architecture is an overview, service requests, dispatch,
technicians, customers, finance, and reports. This is our design inference from the
user's scenario and these products, not a claim that they implement the same model.
The interface uses original Persian copy and an original RTL layout.

The implementation is a local demonstration. Records are stored in browser local
storage. Money is displayed in toman as an explicitly provisional demo choice.
Commission is an explicit amount, not an assumed percentage. Completing a job does
not silently create a receipt. Actual receipts and disbursements belong to a separate
ledger. A real deployment still needs backend authorization, transaction controls,
auditing, approved workflow rules, and a confirmed currency/calendar policy.

## Later decisions

Confirm commission basis (labor, parts, or total), collection by company versus
technician, refunds, multiple visits, parts inventory, notifications, roles, regional
coverage, tax, settlement approval, and reporting periods before production use.
