# Design system reference

## Visual style
- Use a restrained neutral palette, rounded surfaces, subtle borders, and clear text hierarchy.
- Light mode uses white surfaces, dark text, and dark slate primary actions.
- Dark mode uses deep slate surfaces, pale text, and pale primary actions.
- Prefer semantic color utilities over hardcoded colors or unrelated palette colors.
- Pair each surface with its matching foreground token.
- All custom CSS colors must use `oklch(...)`.

## Semantic colors
| Utilities | Purpose |
| --- | --- |
| `bg-background text-foreground` | Page surface and default text |
| `bg-card text-card-foreground` | Cards and contained panels |
| `bg-popover text-popover-foreground` | Floating menus and popovers |
| `bg-primary text-primary-foreground` | Main actions |
| `bg-secondary text-secondary-foreground` | Lower-emphasis actions |
| `bg-muted` | Subdued background regions |
| `text-muted-foreground` | Supporting text, descriptions, placeholders |
| `bg-accent text-accent-foreground` | Hover and selected surfaces; subtle, not a bright brand color |
| `bg-destructive text-destructive-foreground` | Destructive actions |
| `text-destructive` | Error text |
| `border-border` | General borders and separators |
| `border-input` | Form-control borders; does not set the background |
| `ring-ring` | Focus-ring color |
| `ring-offset-background` | Focus-ring offset color matching the page |
| `bg-chart-1` through `bg-chart-5` | Five chart-series colors; also usable with `fill-*` and `stroke-*` |

## Sidebar
- Container: `bg-sidebar text-sidebar-foreground`.
- Prominent or active item: `bg-sidebar-primary text-sidebar-primary-foreground`.
- Hover surface: `bg-sidebar-accent text-sidebar-accent-foreground`.
- Dividers: `border-sidebar-border`; focus rings: `ring-sidebar-ring`.

## Rounded corners
Base radius: `--radius: 0.625rem`. Approximate sizes assume a 16px root font.

| Utility | Radius |
| --- | --- |
| `rounded-sm` | Base − 4px ≈ 6px |
| `rounded-md` | Base − 2px ≈ 8px |
| `rounded-lg` | Base ≈ 10px |
| `rounded-xl` | Base + 4px ≈ 14px |
| `rounded-2xl` | Base + 8px ≈ 18px |
| `rounded-3xl` | Base + 12px ≈ 22px |
| `rounded-4xl` | Base + 16px ≈ 26px |

Prefer `rounded-md` for controls and `rounded-lg` for cards and popovers.

## Fixed grayscale utilities
- `shade-1` through `shade-9` set both background and text color; they do not adapt to dark mode.
- Background OKLCH lightness, in order: `0.95`, `0.85`, `0.75`, `0.65`, `0.55`, `0.45`, `0.35`, `0.25`, `0.12`; chroma and hue are zero.
- `shade-1`–`shade-4` use black text; `shade-5`–`shade-9` use white text. Check contrast for the chosen size.
- `block-shade` adds a 1px solid border in the theme's foreground color.
- Shades add no padding, radius, or layout. Prefer semantic surfaces for themed components.

## Component styling conventions
- Card: `rounded-lg border border-border bg-card p-6 text-card-foreground`.
- Primary button: `rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90`.
- Input: `rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground`.
- Heading: `text-lg font-semibold`; supporting text: `text-sm text-muted-foreground`.
- Focus: `focus-visible:ring-2 focus-visible:ring-ring`; add `focus-visible:ring-offset-2 focus-visible:ring-offset-background` when needed.
- Disabled controls: `disabled:opacity-50`; errors: `aria-invalid:border-destructive` with visible error text.
- Use consistent standard Tailwind spacing and responsive layouts; no custom spacing or typography scale is defined.
- Semantic colors switch automatically under a `.dark` ancestor; avoid redundant `dark:` color overrides.
- Color utilities set color only: add `border` for border width and `ring-2` for ring width.
- Opacity modifiers such as `/90` adjust opacity; verify contrast and keep focus visible.

## Canvas stage colors

Canvas boxes match the canvas surface (30% muted over background) and use the
normal foreground text color. A 2px border shows progress: amber for Hypothesis,
blue for Metric, violet for Experiment, and green for Decision. Semantic
`--stage-*` OKLCH tokens have brighter dark-mode variants. Green identifies the
Decision stage, not a PASS result. Always show the stage name beside the title.
