# Visual QA Notes

## Desktop, 1280 × 720

The dashboard renders as a fixed left command sidebar with a wide editorial canvas. The navy hero, warm paper background, signal red action cues, cyan measurement cues, and gold investment accents are visually coherent. The public-context strip, model disclosure, executive KPI cards, recommendation card, chart, ranking panel, and quality panel are all visible in the full-page capture. The portfolio ranking now correctly uses the base-case ROI from the asset inventory rather than the control-only lower-bound scenario.

## Mobile, 375 × 812

The sidebar collapses into a compact brand header and horizontally scrollable navigation. The hero, disclosure, public context, KPI grid, chart, recommendation card, ranking, and quality panels stack without horizontal overflow. The recommendation card remains legible and the measurement caveat remains visible. Smaller chart labels are acceptable at this width because the page is intended for executive scanning rather than mobile chart analysis.

## Validation outcome

The desktop and mobile previews show no visible clipping, broken assets, or unsupported image references. TypeScript validation passes. The full Vitest suite passes with 13 tests across 6 files. The production build passes.
