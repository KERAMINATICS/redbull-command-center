# Sponsorship Valuation Model Report

## Input design

The script uses a deterministic asset inventory with eight sponsorship elements: jersey front, boundary LED, strategic timeout, digital match hub, fan park, creator matchday, retail take-over, and training ground. Public IPL audience facts are not used as sponsor-level outcomes. The internal reach, conversion, retail lift, rights fee, placement, and engagement fields are simulated because the portfolio case has no private sponsor feed.

## Calculation flow

The exposure quality score is a weighted combination of visibility duration, screen placement, audience quality, engagement quality, and normalized conversion quality. Quality-adjusted contacts are reach multiplied by this score. Media-equivalent value is quality-adjusted contacts multiplied by the modeled CPM.

Three attribution cases are calculated. Direct value uses observed-in-model conversions multiplied by a contribution-margin proxy. Assisted plus retail adds assisted conversion value and a modeled retail uplift contribution. Control-market lift applies a conservative haircut to the direct and retail response to represent a future treatment-control design.

The base value combines control-market lift with a conservative share of media-equivalent value. Portfolio ROI equals base value minus rights fee divided by rights fee. Recommendation bands are **renew / scale** at high positive ROI and confidence, **renegotiate** for positive but evidence-sensitive value, **test** for marginal value, and **exit / replace** when modeled value does not compensate for fee.

## Uncertainty design

The script generates 4,000 deterministic-seed perturbations around modeled lift. It reports P10, P50, and P90 as a decision range. The range is explicitly not a real-world confidence interval because the underlying funnel fields are synthetic. A live deployment should replace the perturbation with cluster-aware bootstrap resampling of measured treatment and control outcomes.

## Outputs

| File | Purpose |
|---|---|
| `model/sponsorship_model.py` | Reproducible input definitions, formulas, and deterministic uncertainty simulation. |
| `client/src/data/sponsorshipData.ts` | Dashboard-ready generated data. |
| `research/ipl-sponsorship-evidence.md` | Public evidence ledger and methodology guardrails. |
| `docs/executive-memo.md` | Executive decision memo. |
| `docs/measurement-plan.md` | Next-season instrumentation and causal measurement plan. |
| `docs/what-would-change-my-recommendation.md` | Conditional recommendation appendix. |

## Re-run

From the project root, run `python3 model/sponsorship_model.py`. The command regenerates the dashboard data from the documented assumptions and prints the portfolio summary and uncertainty range.
