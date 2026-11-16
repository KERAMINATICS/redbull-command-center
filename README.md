# Business Analytics Portfolio: Red Bull India + IPL Sponsorship

> Two independent portfolio case studies demonstrating decision framing, analytical modeling, measurement design, and clear communication. All company-specific performance data in the demonstrations is simulated; neither Red Bull nor any IPL sponsor or rights holder supplied, validated, or endorsed these analyses.

## Portfolio overview

| Project | Business question | What it demonstrates | Evidence boundary |
|---|---|---|---|
| **Red Bull India Channel & Activation Analytics** | Which route-to-market channel should receive the next increment of growth investment in India, and what evidence would justify that decision? | Six channels across six Indian cities and 24 months; channel economics, consumer-growth KPIs, ₹1M investment scenario, forecast benchmark, city-channel commercial profiles, sports-activation measurement, and a static dashboard. | Public company sources establish context only. Channel, financial, consumer, forecast, and activation figures are simulated. The modeled recommendation—convenience as the scale/profit foundation and quick commerce as the incremental-growth candidate—is conditional on those assumptions, not a claim about actual Red Bull performance. |
| **IPL Sponsorship Commercial Value Engine** | Does league-level reach establish that an individual sponsor asset caused incremental contribution? | An interactive sponsorship decision dashboard with asset economics, contribution-only ROI, a separate media-equivalent exposure metric, scenario analysis, negotiation simulator, protected evidence workflows, and a treatment/control measurement plan. | JioStar’s public IPL reach is contextual. Sponsor-level assets, fees, and outcome fields in the demo are synthetic until real observations are uploaded. Media-equivalent value is not treated as profit or added to commercial ROI. |

This repository contains both workstreams, but their data and brand claims are separate. The Red Bull analysis does **not** feed the IPL web app. Present each project as an independent portfolio case and never imply company access or endorsement.

## Video strategy applied

The attached video’s method is translated into a reusable BA workflow: (1) begin with a primary public source, (2) choose one narrow decision problem, (3) build a small decision-support prototype, and (4) credit the source and share a concise walkthrough. Its closing advice is to make one company/project high quality rather than rush out shallow clones. See [`docs/ba-project-playbook.md`](docs/ba-project-playbook.md) for the video analysis, this project’s application, interview summary, and outreach template.

## Start here

- **For the Red Bull channel case:** [`docs/case_study.md`](docs/case_study.md), [`site/index.html`](site/index.html), [`site/README.md`](site/README.md), [`docs/model_card_and_validation.md`](docs/model_card_and_validation.md), [`docs/powerbi_dashboard_spec.md`](docs/powerbi_dashboard_spec.md), [`docs/repo_audit.md`](docs/repo_audit.md), and [`DEFENSE_GUIDE.md`](DEFENSE_GUIDE.md).
- **For the IPL sponsorship case:** [`docs/ba-project-playbook.md`](docs/ba-project-playbook.md), [`docs/executive-memo.md`](docs/executive-memo.md), [`docs/measurement-plan.md`](docs/measurement-plan.md), and [`research/ipl-sponsorship-evidence.md`](research/ipl-sponsorship-evidence.md).
- **For project scope and ownership:** [`docs/project_brief.md`](docs/project_brief.md) (owner: **KERAMINATICS**).

The Red Bull case’s full deliverable map is in the linked case study and documentation; the IPL app’s model, data, and evidence boundaries are documented in the linked memo, measurement plan, and source ledger.

## Run the IPL web application

The interactive application uses React, Vite, TypeScript, Tailwind, Recharts, tRPC, Express, Drizzle, MySQL/TiDB, and Manus OAuth. Runtime environment variables are supplied by WebDev; do not commit `.env` files or credentials.

```bash
pnpm install
pnpm dev
```

For production checks:

```bash
pnpm check
pnpm test
pnpm build
pnpm start
```

The app includes the overview, asset inventory, attribution, negotiation, measurement, decision register, and evidence ingestion workflows. Uploaded market observations require pre/post observations for treatment and control; the demo’s bootstrap interval is mechanically narrow with one observation per cell, so use repeated market-period observations and stronger diagnostics for decision-grade inference.

Evidence CSV format:

```text
sourceType,externalId,assetKey,market,eventDate,metric,metricValue,consented
```

Treatment/control CSV format:

```text
market,periodKey,periodStage,groupType,outcomeValue,sampleSize
```

Allowed evidence `sourceType` values are `exposure`, `crm`, `qr`, and `retail`. Upload de-identified identifiers only and include consent flags where customer-level joins are used. No live CRM, retail, QR, or media connectors are configured in this portfolio demo.

## Reproduce the Red Bull analysis

From the repository root:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 scripts/create_redbull_portfolio_data.py
python3 scripts/analyze_redbull_portfolio.py
python3 scripts/create_redbull_charts.py
python3 scripts/redbull_advanced_analytics.py
```

The scripts use relative paths and fixed seeds for synthetic data. The first script regenerates CSV inputs; the following scripts produce summaries, figures, and advanced outputs. `scripts/redbull_ai_insight_pipeline.py` is optional, needs a separately configured API key, and is not required to reproduce the quantitative results.

The Red Bull static dashboard is a single-page Chart.js prototype with no backend, database, authentication, build system, or live company data connection. Preview it locally with:

```bash
python3 -m http.server 8000 --directory site
# open http://localhost:8000
```

See [`site/README.md`](site/README.md) for its data boundary and local preview details.

## Validation status

The latest IPL app update passed the TypeScript check, **17 Vitest tests across 7 files**, and the Vite/server production build. Desktop and 390px mobile previews were reviewed for the public-problem narrative, model separation, and dual-scale chart. The build completes; Vite still reports a non-blocking JavaScript bundle-size warning.

## Repository map

```text
client/src/pages/                    IPL application pages
client/src/data/sponsorshipData.ts   IPL synthetic scenario data
server/                              API, validation, model tests
model/                               IPL sponsorship model and report
scripts/                             Red Bull Python generation and analysis
site/                                Red Bull static Chart.js dashboard
 data/                               Red Bull synthetic data and summaries
advanced_outputs/                    Forecast, segmentation, DiD and bootstrap outputs
figures/                             Red Bull case charts
docs/                                Case studies, strategy playbook, QA and measurement plans
research/                            IPL public-source evidence ledger
```

## Limitations and attribution

The Red Bull channel and activation values are synthetic assumptions, not observed company results. The IPL sponsor-level inputs are also synthetic, and public reach does not establish sponsor-level incrementality. Treat both as analytical prototypes that demonstrate method, not as production systems or actual company recommendations. For real use, replace assumptions with authorized data, define a measurement protocol, validate assumptions, and re-estimate uncertainty.

The work is an independent educational portfolio project by **KERAMINATICS**. Public facts and brand assets remain subject to their original owners; review the linked source notes before reuse.
