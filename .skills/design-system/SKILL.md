---
name: design-system
description: Apply and review the dashboard's compact design system when building feature UI or shared components, changing typography or spacing, or fixing inconsistent text sizes, theme colors, tables, and RTL/LTR layouts.
---

# Dashboard design system

Apply the existing compact product hierarchy. Follow AGENTS.md for project
constraints and FSD for ownership; this skill defines visual implementation and
review, not business workflows or a replacement UI stack.

## Establish the source of truth

Before changing UI, read [the design-system reference](../../docs/design-system.md)
for role meanings, weights and table density. Inspect the relevant sources:

- [Theme CSS](../../src/app/styles/index.css): primitive scale, semantic roles,
  paired line heights, weights and light/dark color tokens.
- [Shared primitives](../../src/shared/ui/primitives/primitives.tsx): PageHeading,
  Panel and StatCard compositions. Inspect the affected shadcn component as well.
- [Class merging](../../src/shared/lib/utils.ts) and
  [regression tests](../../src/shared/lib/utils.test.ts): custom font-role handling.

CSS owns values, components own defaults and the reference owns role definitions.
Keep numeric token tables there rather than copying them into this skill.

## Apply the hierarchy

- Use `text-body` for ordinary content, controls and table data; `text-caption`
  for secondary details; `text-section` for card/dialog/section titles;
  `text-page-title` for page titles; and `text-metric` for summary values.
  Keep larger roles deliberate rather than inherited by ordinary content.
- Preserve Input/Textarea's `text-editable md:text-body` default. Mobile editable
  text has its own role; it is not the app-wide body default.
- Choose weight separately from size: normal for body/data, medium for labels
  and controls, semibold for headings/emphasis. Use only bundled font weights.
- Let shared controls and headings own their defaults. Use existing component
  size variants and PageHeading/Panel/StatCard where their semantics fit. Put
  typography classes directly on the text element instead of parent selectors
  that resize descendant controls.
- Fit long Persian and English content through wrapping and flexible layout.
  Check line height before setting fixed heights. Preserve meaningful financial
  digits; do not hide them with truncation or shrink the app to make them fit.
- Use existing spacing utilities and semantic foreground/background pairs.
  Keep the same hierarchy in both themes, use Vazirmatn for Persian and Open Sans
  for English, and use logical spacing for RTL/LTR. Direction does not change the
  calendar or currency.
- Reuse Table/DataTable defaults. Row spacing belongs on header/body cells;
  retain horizontal scrolling and the sort controls' typography. Change the
  shared primitive only when every table should receive the new density.
- Obtain additional shadcn source directly from the official website/registry
  under the project's no-CLI convention. Use `cn()` for merging or conditional
  classes, leaving static element classes as ordinary strings.

## Change tokens deliberately

For unexpectedly large text, trace the inherited body/heading defaults and local
classes first. Correct the wrong role at its owner. Change an existing semantic
role's CSS value only when the intended change applies to all its consumers;
keep browser root sizing and the primitive Tailwind scale stable.

When a genuinely new reusable role is necessary:

1. Add its `--text-<role>` and `--text-<role>--line-height` variables in `@theme`,
   referencing the existing primitive scale where possible. Check for a matching
   color name: a class such as `text-input` can otherwise set both size and color.
2. Register the role name in the shared `tailwind-merge` text theme. A merged
   semantic color must preserve the size class, and a size override must replace
   the previous size without removing its color.
3. Apply the role in the owning primitive or text elements and update the reference.
   Extend the existing merge tests when class behavior changes.

## Review and verify

Review affected defaults and overrides together. Check for legacy tiny aliases,
arbitrary font values, ancestor font overrides, redundant responsive rules and
oversized inherited headings. Evaluate existing exceptions in context; avoid
blanket replacements across unrelated components.

For UI changes, follow AGENTS.md's application checks and inspect narrow/wide
layouts, long labels, both languages/themes and empty/populated tables when
browser access is available. For token changes, also verify the generated CSS
contains the role's font-size and line-height and does not introduce a color
collision. If browser access is unavailable, report the limitation; source/build
checks do not prove visual rendering.

For skill/documentation-only updates, validate frontmatter, local references and
formatting, including this directory explicitly because `.skills/` is excluded
from the normal formatting glob. Rebuild the app only if implementation changed.
