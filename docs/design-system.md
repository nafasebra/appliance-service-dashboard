# Typography and table density

This dashboard uses a compact product typography hierarchy inspired by Carbon's
productive type set, adapted to the existing Vazirmatn font and shadcn components.
It is an application-specific adaptation, not a full Carbon implementation.

For new UI and reviews, use the local
[design-system skill](../.skills/design-system/SKILL.md). The source of truth for
values is `src/app/styles/index.css`; this reference defines their intended roles.
Keep the browser root size unchanged so rem values respect user preferences.

## Application roles

| Utility / CSS variable                  | Default size | Line height | Weight     | Role                                                |
| --------------------------------------- | ------------ | ----------- | ---------- | --------------------------------------------------- |
| `text-caption` / `--text-caption`       | 12px         | 16px        | 400 or 500 | Helper text, captions, badges and secondary details |
| `text-body` / `--text-body`             | 14px         | 20px        | 400        | Default body text, table content and descriptions   |
| `text-body` / `--text-body`             | 14px         | 20px        | 500        | Controls, labels and navigation emphasis            |
| `text-section` / `--text-section`       | 16px         | 24px        | 600        | Section, card and dialog titles                     |
| `text-page-title` / `--text-page-title` | 20px         | 28px        | 600        | Page titles and prominent overview headings         |
| `text-metric` / `--text-metric`         | 24px         | 32px        | 600        | Summary metrics; 20px on narrow screens when needed |
| `text-editable` / `--text-editable`     | 16px         | 24px        | 400        | Mobile Input/Textarea; `md:text-body` on desktop    |

Each role has a matching `--text-<role>--line-height` variable. Roles reference the
standard Tailwind primitive scale (`--text-xs`, `--text-sm`, `--text-base`, etc.)
in `@theme`, so shared components and page-specific text use one maintained set
of variables. Use role utilities in application JSX instead of choosing arbitrary
sizes or redefining Tailwind's primitive size meanings.

Role names are registered in the shared `cn()` helper's `tailwind-merge` text
theme. This keeps a semantic color override from accidentally removing a custom
font-size class. Add new role names there alongside new CSS tokens.

Weights use `--font-weight-normal` (400), `--font-weight-medium` (500),
`--font-weight-semibold` (600) and `--font-weight-bold` (700), all locally bundled.
Use bold sparingly rather than increasing ordinary labels' size or weight.

## Component and layout defaults

The body inherits the 14px body role. Default h1 uses the 20px page-title role,
h2 the 16px section role and h3 14px semibold. Shared CardTitle and DialogTitle
use the section role. This prevents unclassified content inheriting oversized
body text or promotional heading sizes.

Shared primitives own their control typography. Input/Textarea retain the 16px
mobile input role, then switch to the 14px body role at the medium breakpoint.
Avoid parent selectors that change descendants' font sizes. Use layout wrapping
for longer labels, not smaller control text. Both themes and interface languages
use identical type roles; retain Vazirmatn and meaningful financial digits.

Shared Table applies `px-4 py-3` to header cells and `px-4 py-4` to body cells.
Cell padding creates row spacing in native tables; padding on `tr` does not.
Keep horizontal overflow scrollable and preserve DataTable sorting/pagination.

## Sources

- [Carbon productive typography and scale](https://www.carbondesignsystem.com/building-blocks/foundations/typography/overview)
- [Tailwind font-size variables](https://tailwindcss.com/docs/font-size)
- [Tailwind font-weight variables](https://tailwindcss.com/docs/font-weight)
- [shadcn Table](https://ui.shadcn.com/docs/components/base/table)
