# Red Bull India Channel & Activation Analytics

> **Independent portfolio case study.** Public information is used only for brand and company context. All channel, financial, consumer, forecast, and activation figures are simulated assumptions used to demonstrate business-analyst methods. No private or confidential Red Bull data was used, and Red Bull did not supply, validate, or endorse this project.

## What this project is

This repository is a consulting-style business analytics case study asking:

> **Which route-to-market channel should receive the next increment of growth investment in India, and what evidence would justify that decision?**

The model covers grocery, convenience, e-commerce, quick commerce, cafés, and sports/events across six Indian cities and 24 months. It combines channel economics, consumer-growth KPIs, forecasting, commercial profiling, an incremental-investment scenario, and a sports-activation measurement model.

The central portfolio lesson is deliberate: **convenience is the modeled scale and contribution-profit foundation, while quick commerce is the modeled incremental-growth candidate.** That recommendation is conditional on transparent synthetic assumptions and must not be presented as actual Red Bull performance.

## What is included

- **Reproducible Python pipeline** for deterministic synthetic-data generation, channel analysis, chart creation, forecasting, commercial profiling, a hypothetical incrementality design, activation bootstrap analysis, and an optional AI-assisted insight workflow.
- **Static dashboard prototype** in [`site/`](site/) using Chart.js. It presents the project’s economics, investment scenario, forecast benchmark, profiles, activation ROI warning, and methodology in a browser-friendly format.
- **Data package** in [`data/`](data/) containing generated CSVs, summaries, and a data dictionary.
- **Advanced outputs** in [`advanced_outputs/`](advanced_outputs/) containing forecast, segmentation, incrementality, bootstrap, and AI-insight outputs.
- **Figures** in [`figures/`](figures/) containing the generated charts used in the case study.
- **Consulting documentation** covering the case study, project brief, model card, Power BI specification, source audit, and interview defense guide.

## Start here

1. [`site/index.html`](site/index.html) — interactive static dashboard prototype.
2. [`docs/case_study.md`](docs/case_study.md) — full write-up: business question, findings, recommendation, methodology, limitations, and interview-ready summary.
3. [`docs/project_brief.md`](docs/project_brief.md) — scope, KPIs, assumptions, and planned deliverables.
4. [`docs/model_card_and_validation.md`](docs/model_card_and_validation.md) — model purpose, validation approach, and limitations.
5. [`docs/powerbi_dashboard_spec.md`](docs/powerbi_dashboard_spec.md) — semantic model, DAX measures, page design, and transparency controls for a Power BI recreation.
6. [`docs/repo_audit.md`](docs/repo_audit.md) — how the JPMorgan Chase Python-training repository was used as an educational reference, not as a data source.
7. [`DEFENSE_GUIDE.md`](DEFENSE_GUIDE.md) — plain-language explanation of the methods and the claims this project can and cannot support.

## Reproduce the analysis

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

The scripts use relative paths and a fixed random seed. The first script regenerates the CSV inputs; the following scripts produce the summaries, figures, and advanced outputs. `scripts/redbull_ai_insight_pipeline.py` is optional: it drafts and critiques an evidence-grounded narrative using an LLM API and requires an API key. It is not required to reproduce the quantitative results.

To preview the dashboard locally without installing frontend dependencies:

```bash
python3 -m http.server 8000 --directory site
# open http://localhost:8000
```

## Repository structure

```text
redbull-command-center/
├── README.md
├── DEFENSE_GUIDE.md
├── requirements.txt
├── data/                  # generated CSVs, summaries, and data dictionary
├── advanced_outputs/      # forecast, profiling, incrementality, bootstrap outputs
├── figures/               # generated charts
├── docs/                  # case study, brief, model card, dashboard spec, source audit
├── scripts/               # five Python scripts, in reproducible run order
└── site/                  # static Chart.js dashboard prototype
```

## Data and evidence boundary

Revenue, margin, CAC, LTV, forecast, activation, and channel figures are simulated for demonstration only. Public Red Bull material is cited in [`docs/case_study.md`](docs/case_study.md) to establish realistic business context, not as evidence for the modeled figures. The repository intentionally separates descriptive outputs, predictive benchmarks, scenario assumptions, and causal-test designs.

The work should therefore be presented as an **analytical prototype**: a demonstration of how a business analyst could frame the decision, define KPIs, build a transparent model, communicate uncertainty, and design the next validation step with real data.
