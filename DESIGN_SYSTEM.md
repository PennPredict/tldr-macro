# TL;DR Macro v2 design system

The v2 interface is feature-gated by `config/features.json` and defaults off. For local QA, set `DESIGN_V2=true`; production remains v1 until the owner runs the separate approval workflow.

## Visual language

- Page: deep navy `#071722`; cards are 4–6% lighter.
- Cards: 15px radius, 1px low-contrast border, 22px padding, 18px gaps.
- One brand accent: teal `#55d7ad`. Direction colors are reserved for ▲, ▼, and ●.
- Hero: Newsreader, 700 weight, `clamp(34px, 5vw, 56px)`.
- Story prose: Newsreader, 17–19px. Interface text: DM Sans, 14–15px.
- Section headings: semantic headings rendered as small uppercase tracked eyebrows.
- Focus: 2px visible ring with 2px offset.
- No heavy shadows, gradients, external fonts, CDNs, tracking, or decorative market photography.

## Components

- Header retains the TL;DR Macro logo, edition timestamp, and freshness behavior.
- Hero uses generated qualitative copy; the one-liner remains in the sticky bar and metadata.
- Market tiles contain only name, value, computed change, and an eligible inline SVG sparkline. Full context expands below the strip.
- Story cards are numbered in flow reading order and keep source, data-note, popover, and agent-view behavior.
- Global cards and the Next/Bottom-line band use equal card geometry and concise copy budgets.

## Data states

- Invalid, stale, contaminated, or unsupported observations are withheld rather than repaired visually.
- Delayed daily data may display for up to three business days with its true observation date.
- Sparklines require at least 15 unique, dated provider observations and a verified prior close in the series.
