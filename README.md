# Red Bull India Channel & Activation Analytics 

> **Independent portfolio case study.** Public information is used only for brand/company
> context. All channel, financial, consumer, forecast, and activation figures are simulated
> assumptions used to demonstrate business-analyst methods. No private or confidential Red
> Bull data was used, and Red Bull did not supply, validate, or endorse this project.

## Business question

Which route-to-market channel should receive the next increment of growth investment in
India, and what evidence would justify that decision?

## Start here

1. [`docs/case_study.md`](docs/case_study.md) — the full write-up: business question, findings,
   recommendation, methodology, and an interview-ready summary.
2. [`docs/project_brief.md`](docs/project_brief.md) — the original scoping document (business
   question, channels in scope, planned KPIs).
3. [`docs/model_card_and_validation.md`](docs/model_card_and_validation.md) — what each model
   does, how it was validated, and its limitations.
4. [`docs/powerbi_dashboard_spec.md`](docs/powerbi_dashboard_spec.md) — star schema, DAX
   measures, and page design for the Power BI build.
5. [`docs/repo_audit.md`](docs/repo_audit.md) — how the public JPMorgan Chase Python-training
   repo was used as an educational reference (not a data source).
6. [`DEFENSE_GUIDE.md`](DEFENSE_GUIDE.md) — plain-language explanation of every method used,
   written so I can defend each choice in an interview without notes.

## Reproduce it

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

python3 scripts/create_redbull_portfolio_data.py    # generates data/*.csv (fixed random seed)
python3 scripts/analyze_redbull_portfolio.py        # channel summary, investment scenario
python3 scripts/create_redbull_charts.py            # figures/*.png
python3 scripts/redbull_advanced_analytics.py       # advanced_outputs/*.csv (forecast, clustering, DiD, bootstrap)
```

`scripts/redbull_ai_insight_pipeline.py` drafts and critiques a narrative using an LLM API and
requires an API key — it's included for completeness but isn't required to reproduce the
quantitative results above. All paths are relative, so this runs from a fresh clone with no
edits.

## Folder structure

```
redbull-channel-analytics/
├── README.md
├── DEFENSE_GUIDE.md
├── requirements.txt
├── docs/                  # case study, brief, model card, Power BI spec, source audit
├── scripts/                # the 5 reproducible Python scripts, in run order
├── data/                   # generated CSVs + data dictionary
├── advanced_outputs/        # forecast, segmentation, DiD, bootstrap outputs
└── figures/                 # generated charts
```

## Data boundary

Revenue, margin, CAC, LTV, forecast, activation, and channel figures are simulated for
demonstration only. Public Red Bull material (company profile, India careers page, support hub)
is cited in `docs/case_study.md` only to establish realistic business context, not as evidence
for the modeled figures.
