# Model Card and Validation Report

## Scope

This document covers the advanced analytics layer for the independent Red Bull India portfolio project. Every result is based on simulated data and is intended to demonstrate professional analytical practice rather than actual Red Bull performance.

## Model inventory

| Model | Purpose | Validation | Interpretation |
|---|---|---|---|
| Holt-Winters / seasonal baseline | Forecast monthly channel units | Six-month out-of-time holdout | Planning baseline; not causal |
| Random Forest regressor | Benchmark nonlinear demand prediction | Six-month out-of-time holdout | Predictive signal only |
| K-means clustering | Segment city-channel profiles | Stability and business interpretability review | Descriptive archetypes, not consumer truth |
| Difference-in-differences design | Estimate hypothetical channel lift | Design specification, not observed experiment | Requires treatment/control execution |
| Bootstrap ROI | Quantify activation ROI uncertainty | 2,000 resamples per attribution case | Uncertainty around modeled attribution |
| LLM insight reviewer | Draft and critique executive narrative | Grounding and schema validation | Human-reviewed assistant, not source of truth |

## Forecasting validation

The Random Forest benchmark outperforms the prior-year seasonal-naive benchmark on this simulated holdout. The observed MAE and RMSE should be shown in the report, but they should not be used to claim that machine learning proves commercial causality. Forecast performance must be monitored on future refreshes and compared with a simple baseline every time.

## Segmentation validation

The clustering model is designed to create interpretable city-channel archetypes such as scale and profit, high-growth acquisition, retention-led, and efficiency watch. The clusters are not latent consumer segments because the data is aggregated at city-channel level. If actual consumer-level data becomes available, replace this model with customer-level RFM, cohort, or propensity features.

## Incrementality validation

The difference-in-differences output is a hypothetical design layered over synthetic data. It is not a causal estimate. A real deployment would require comparable treatment and control geographies, a pre-period parallel-trends check, contamination monitoring, pre-registered KPIs, and confidence intervals. The primary decision metric should be incremental contribution profit rather than gross revenue.

## Activation uncertainty

The bootstrap ROI output shows uniformly negative modeled direct-profit ROI across conservative, base, and upside attribution cases. This should be interpreted as a warning that the current direct-attribution design does not justify scaling activation spend—not as proof that real brand activations have no business value. The next model should add control-based lift, assisted conversions, retail sell-through, brand lift, and longer-term customer value.

## AI governance

The AI pipeline uses `gpt-5-mini` for an initial structured draft and `gpt-5` for skeptical review. Both models receive computed tables rather than unverified web claims. The output schema requires an insight, evidence points, caveats, and validation plan. A human analyst must review all text before publication. The system must reject any draft that introduces unsupported factual claims, treats simulated figures as actual, or converts scenario assumptions into causal conclusions.

## Limitations

The project does not include real retailer data, inventory, distributor sell-in, consumer-panel records, randomized marketing tests, actual media delivery, brand-lift surveys, or proprietary activation costs. The results therefore demonstrate a rigorous workflow and decision framework, not a market estimate.

## Release criteria

The project is publication-ready only when the README disclosure remains visible, generated files can be recreated from the scripts, validation metrics are reported, assumptions are documented, charts carry simulated-data labels, and the portfolio narrative distinguishes descriptive, predictive, scenario, and causal statements.
