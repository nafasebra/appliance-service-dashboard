# Project skills

Downloaded on 2026-11-16 using the Codex skill installer. Each directory includes
its upstream `SKILL.md` and supporting files. These are project-local copies.

| Directory                | Upstream source                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `i18n/` | [Official i18next localization skill](https://github.com/i18next/i18next-cli/tree/main/skills/i18next-localization), installed on 2026-11-17 |
| `react/`                 | [Vercel React best practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)   |
| `tailwind/`              | [brpaz Tailwind v4](https://github.com/brpaz/agent-skills/tree/main/skills/tailwind-v4)                            |
| `shadcn/`                | [Official shadcn skill](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn)                                   |
| `frontend-architecture/` | [Singular frontend architecture](https://github.com/we-are-singular/skills/tree/main/skills/frontend-architecture) |
| `zustand/` | [Microsoft Zustand store skill](https://github.com/microsoft/skills/tree/main/.github/plugins/azure-sdk-typescript/skills/zustand-store-ts) |
| `tanstack-table/` | Official skills bundled with `@tanstack/table-core@9.3.1` and `@tanstack/react-table@9.3.1`; see [local sources](tanstack-table/SOURCES.md) |

Read the relevant skill before related implementation work. User instructions and
the project `AGENTS.md` take precedence over upstream defaults. In particular:

- Use React with Vite; Next.js-specific advice applies only when relevant.
- Use Tailwind v4, existing theme tokens, Persian RTL, and local Vazirmatn.
- Obtain shadcn component source from the official website/registry without running
  the shadcn CLI. Preserve the local `src/shared/ui/` component library.
- Preserve feature boundaries and the current frontend demonstration scope.
- TanStack Table skills were copied from the installed official npm packages on
  2026-11-17. Start with `tanstack-table/core/SKILL.md` and the React
  `getting-started/SKILL.md`. Read local files in place of upstream `intent load`
  commands; no Intent CLI is needed. Preserve v9 APIs and the shared DataTable.
- Zustand was installed on 2026-11-17. Use `src/shared/store/` and direct module
  imports instead of the upstream example directory and barrel. Keep legacy storage
  formats and validation, including the existing storage-failure behavior; middleware
  is added only when it supports that contract.

Installing a skill does not authorize running bundled scripts, deploying, or
changing dependencies. Apply only the guidance needed for the user's task.
