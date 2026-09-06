# TATA IPL Commercial Value Engine

> **Independent portfolio case study and decision-support dashboard.** Public IPL and media facts are used only as context. Sponsor-level commercial, channel, consumer, forecast, and activation values are simulated unless uploaded through the protected evidence workflow. This project is not affiliated with, endorsed by, or supplied by the IPL, BCCI, Red Bull, JioStar, or any rights holder.

## What this project does

The application turns sponsorship inventory into a practical commercial operating system. It includes an IPL-themed executive overview, asset inventory, attribution and uncertainty analysis, renewal negotiation simulator, next-season measurement plan, decision register, and evidence ingestion workspace.

The final workflow is intentionally split into two layers:

1. **Modeled portfolio layer:** a transparent, deterministic demonstration of asset quality, value, cost, ROI, uncertainty, and negotiation thresholds.
2. **Evidence layer:** protected database workflows for decision ownership, exposure/CRM/QR/retail evidence, and treatment-control market observations. Uploaded market observations produce a difference-in-differences estimate with a bootstrap confidence interval.

## Run the web application

```bash
pnpm install
pnpm dev
```

The production commands are:

```bash
pnpm check
pnpm test
pnpm build
pnpm start
```

The web application uses React, Vite, TypeScript, Tailwind, Recharts, tRPC, Express, Drizzle, MySQL/TiDB, and Manus OAuth. Environment variables are supplied by the WebDev runtime; do not commit `.env` files or credentials.

## Database

The schema lives in `drizzle/schema.ts`. The checked-in migration history is under `drizzle/`, including the decision register, sponsorship evidence, and market observation tables. In a configured environment, use:

```bash
pnpm db:push
```

Evidence and decision mutations require an authenticated user. The dashboard remains reviewable without persisted rows by showing clearly labelled demo decisions and an empty real-observation state.

## CSV data contracts

Evidence ingestion accepts:

```text
sourceType,externalId,assetKey,market,eventDate,metric,metricValue,consented
```

Allowed `sourceType` values are `exposure`, `crm`, `qr`, and `retail`. Upload de-identified identifiers only and include consent flags where customer-level joins are used.

Treatment-control market ingestion accepts:

```text
market,periodKey,periodStage,groupType,outcomeValue,sampleSize
```

The causal workflow requires pre and post observations for both treatment and control. It returns a difference-in-differences estimate and a 2,000-resample bootstrap interval. With only one observation per cell, the interval will be mechanically narrow; use repeated market-period observations for decision-grade inference.

## Reproducible analytics layer

The original Python portfolio analysis remains in place for reproducibility:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 scripts/create_redbull_portfolio_data.py
python3 scripts/analyze_redbull_portfolio.py
python3 scripts/create_redbull_charts.py
python3 scripts/redbull_advanced_analytics.py
```

The Python pipeline uses fixed seeds where synthetic data is generated. The LLM insight script requires a separately configured API key and is not required for the dashboard.

## Repository map

```text
client/src/pages/Home.tsx                 Main dashboard shell and page views
client/src/pages/DecisionWorkspace.tsx   Decision register UI
client/src/pages/EvidenceWorkspace.tsx    CSV ingestion and causal analysis UI
client/src/index.css                      IPL-themed product and responsive styles
client/src/data/sponsorshipData.ts        Deterministic model output used by the UI
server/db.ts                              Database queries and estimators
server/routers.ts                         Typed tRPC procedures
drizzle/schema.ts                         MySQL/TiDB schema
drizzle/*.sql                             Generated migrations
data/                                     Reproducible synthetic analytics data
advanced_outputs/                         Forecast, segmentation, bootstrap, and DiD outputs
docs/                                     Case study, measurement, QA, and model documentation
model/                                    Sponsorship model and report
scripts/                                  Python generation and analysis scripts
```

## Validation status

The final refactor was validated with:

- 15 Vitest tests passing across 7 test files.
- TypeScript check passing.
- Vite and server production build passing.
- Browser preview inspected for Overview, Decisions, and Evidence workflows.
- Responsive shell rules added for desktop, tablet, and mobile layouts.

## Limitations and next steps

No external CRM, retail, QR, or media API credentials were supplied, so live source synchronization is not enabled. The protected ingestion layer is ready for those connectors. For production use, add source-specific authentication, scheduled refresh jobs, data-quality checks, role-based approval permissions, audit history, and stronger statistical diagnostics such as pre-trend tests, clustered standard errors, and placebo checks.

## License and attribution

This repository is an independent educational and portfolio artifact. Review the source notes in `research/`, `docs/`, and `brand_playbook.md` before reusing public facts or brand assets.
