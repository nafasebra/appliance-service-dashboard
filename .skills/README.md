# Project skills

Downloaded on 2026-11-16 using the Codex skill installer. Each directory includes
its upstream `SKILL.md` and supporting files. These are project-local copies.

| Directory                | Upstream source                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `react/`                 | [Vercel React best practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)   |
| `tailwind/`              | [brpaz Tailwind v4](https://github.com/brpaz/agent-skills/tree/main/skills/tailwind-v4)                            |
| `shadcn/`                | [Official shadcn skill](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn)                                   |
| `frontend-architecture/` | [Singular frontend architecture](https://github.com/we-are-singular/skills/tree/main/skills/frontend-architecture) |

Read the relevant skill before related implementation work. User instructions and
the project `AGENTS.md` take precedence over upstream defaults. In particular:

- Use React with Vite; Next.js-specific advice applies only when relevant.
- Use Tailwind v4, existing theme tokens, Persian RTL, and local Vazirmatn.
- Obtain shadcn component source from the official website/registry without running
  the shadcn CLI. Preserve the local `src/shared/ui/` component library.
- Preserve feature boundaries and the current frontend demonstration scope.

Installing a skill does not authorize running bundled scripts, deploying, or
changing dependencies. Apply only the guidance needed for the user's task.
