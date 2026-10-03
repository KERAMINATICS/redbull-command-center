# Red Bull India Commercial Command Center

This folder contains the **static dashboard prototype** for the Red Bull India Channel & Activation Analytics portfolio case study. It is the browser-facing presentation layer for the simulated analytical outputs in the repository root.

## What the dashboard shows

The single-page dashboard uses Chart.js from a CDN and presents:

- An executive overview of the modeled channel decision.
- Channel economics across grocery, convenience, e-commerce, quick commerce, cafés, and sports/events.
- The ₹1.0 million incremental-investment scenario and channel ranking.
- A Random Forest versus seasonal-naive forecast benchmark.
- City-channel commercial profiles created with K-means clustering.
- Sports-activation direct-attribution ROI and the resulting measurement warning.
- Methodology, evidence boundaries, and the distinction between simulated assumptions and real-world validation.

The page is intentionally static: there is no backend, authentication, database, build system, or live Red Bull data connection in this folder. It reads the values embedded in `index.html`, which were produced by the reproducible Python pipeline in [`../scripts/`](../scripts/).

## Relationship to the rest of the repository

- [`../README.md`](../README.md) — project overview and reproducibility instructions.
- [`../docs/case_study.md`](../docs/case_study.md) — detailed business narrative and recommendation.
- [`../docs/model_card_and_validation.md`](../docs/model_card_and_validation.md) — model definitions and limitations.
- [`../data/`](../data/) — simulated inputs and summaries.
- [`../advanced_outputs/`](../advanced_outputs/) — forecast, profiling, incrementality, bootstrap, and AI-insight outputs.

## Run it locally

No frontend installation is required. From the repository root, run:

```bash
python3 -m http.server 8000 --directory site
```

Then open [http://localhost:8000](http://localhost:8000). The page loads Chart.js and web fonts from public CDNs, so an internet connection is needed for the charts and typography to render as designed.

## Transparency note

All business, financial, consumer, forecast, and activation values shown in the dashboard are **simulated assumptions** created for an independent portfolio case study. They do not represent actual Red Bull India performance. Public Red Bull sources are used only for context, and Red Bull did not supply, validate, or endorse the project.
