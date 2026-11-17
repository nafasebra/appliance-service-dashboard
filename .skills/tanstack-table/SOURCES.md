# TanStack Table skill sources

Copied on 2026-11-17 from the official installed npm packages, version 9.3.1.
Upstream skill content and relative reference paths are preserved.

- Core: `node_modules/@tanstack/table-core/skills/` copied into this directory.
- React: `node_modules/@tanstack/react-table/skills/` copied into `react/`.
- License: upstream MIT license in `LICENSE`.
- Upstream repository: https://github.com/TanStack/table

Start with [core](core/SKILL.md), then [React setup](react/getting-started/SKILL.md).
Read [features](table-features/SKILL.md) for sorting or other processing changes;
read [React state](react/table-state/SKILL.md) for subscriptions and state ownership.
Additional migration and custom-feature skills are available when those tasks arise.

The project reads these local files directly instead of running `intent load`.
Refresh these copies when upgrading TanStack Table; package-lock.json records the
installed package integrity. Examples are references, not scripts to execute.
