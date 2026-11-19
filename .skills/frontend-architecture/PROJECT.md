# Project architecture override

Reviewed against upstream on 2026-11-19. The upstream frontend architecture skill
is unchanged. This companion records the project's FSD-specific choices.

For layer placement, slice boundaries, public APIs, state ownership, or architecture
reviews, read [the official FSD skill](../fsd/SKILL.md), then
[the project architecture](../../docs/architecture.md). Those decisions specialize
the general guidance in `SKILL.md`.

- Use FSD v2.1's pages-first approach. Single-page behavior stays in its page slice.
- Dependency direction is `app -> pages -> features -> entities -> shared`.
- Use explicit `index.ts` contracts for cross-slice imports. These deliberate FSD
  entry points are the exception to the general advice against barrel files.
- Shared UI has component-sized entry points to preserve lazy calendar loading.
- Business Zustand stores belong in their entity's `model/`; only the generic
  theme preference stays in `shared/store`.
- Preserve the user's `hooks/` and `i18n/` segments and `.tsx` hook convention.
- Colocate translations with the page, feature, or app shell that owns the copy.
- Run `npm run architecture:check` after moving code or changing imports.
- Keep the current browser-local demo and financial invariants intact. FSD does
  not authorize new workflows, backend services, or storage migrations.
