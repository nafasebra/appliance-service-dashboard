# Project skills

Read the skill relevant to the task, then load its supporting references as needed.
Project constraints live in [AGENTS.md](../AGENTS.md); architecture decisions live
in [docs/architecture.md](../docs/architecture.md). Those specialize upstream
examples for this React/Vite dashboard.

## Entry points

For new feature UI, shared components, typography or spacing reviews, start with
the local [design-system skill](design-system/SKILL.md). It applies the project's
[design-system reference](../docs/design-system.md) alongside the upstream skills
below.

| Task                                               | Start here                                                                                              | Upstream source                                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Layer placement, ownership, imports or migrations  | [FSD](fsd/SKILL.md)                                                                                     | [Official Feature-Sliced Design](https://github.com/feature-sliced/skills/tree/master/feature-sliced-design)            |
| General frontend design and separation of concerns | [Frontend architecture](frontend-architecture/SKILL.md)                                                 | [Singular](https://github.com/we-are-singular/skills/tree/main/skills/frontend-architecture)                            |
| React components, hooks or performance             | [React](react/SKILL.md)                                                                                 | [Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)                             |
| Tailwind utilities, tokens or responsive styles    | [Tailwind v4](tailwind/SKILL.md)                                                                        | [brpaz](https://github.com/brpaz/agent-skills/tree/main/skills/tailwind-v4)                                             |
| UI primitives and composition                      | [shadcn/ui](shadcn/SKILL.md)                                                                            | [Official shadcn](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn)                                              |
| Zustand state, selectors or persistence            | [Zustand](zustand/SKILL.md)                                                                             | [Microsoft](https://github.com/microsoft/skills/tree/main/.github/plugins/azure-sdk-typescript/skills/zustand-store-ts) |
| Localization setup and extraction                  | [i18next](i18n/SKILL.md) and [project conventions](../docs/localization.md)                             | [Official i18next CLI](https://github.com/i18next/i18next-cli/tree/main/skills/i18next-localization)                    |
| Table columns, processing or state                 | [Core](tanstack-table/core/SKILL.md), then [React setup](tanstack-table/react/getting-started/SKILL.md) | [Installed package sources](tanstack-table/SOURCES.md)                                                                  |

FSD is the placement authority; the general frontend and React skills complement
it. Explicit FSD entry points are intentional exceptions to general barrel-file
advice. Apply framework-specific examples only where they fit Vite.

For tables, load [features](tanstack-table/table-features/SKILL.md) for sorting or
pagination and [React state](tanstack-table/react/table-state/SKILL.md) for
subscriptions. Read local references instead of invoking `intent load`.

## Provenance and maintenance

- React, Tailwind, shadcn and frontend architecture were initially downloaded on
  2026-11-16. i18next and Zustand were added on 2026-11-17.
- TanStack Table skills came from the installed official 9.3.1 packages on
  2026-11-17. Refresh them alongside the dependency; preserve the bundled license.
- FSD was installed on 2026-11-19. Frontend architecture was checked against
  upstream that day; its upstream content was unchanged.
- Retain upstream skill text, referenced examples, templates, metadata and licenses.
  Local compatibility notes must be clearly marked. Upstream skill evaluation
  fixtures are omitted because this repository consumes, rather than develops,
  those skills.
- Keep project rules in AGENTS.md and the linked project documents. When refreshing
  a skill, preserve the marked project override and check its local links.

The shadcn skill's CLI commands and embedded context command are upstream examples;
this project obtains component source directly without running the CLI. Skill
installation alone does not authorize deployments or unrelated dependency changes.
