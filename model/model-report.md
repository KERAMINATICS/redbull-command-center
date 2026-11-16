# Sponsorship Valuation Model Report

## Decision objective

Support an independent portfolio demonstration of how to screen sponsorship inventory without confusing public reach or media-equivalent value with sponsor-level incremental contribution. The model is a structured scenario, not a valuation of actual IPL rights or any sponsor.

## Input design

The deterministic inventory contains eight sponsorship assets: jersey front, boundary LED, strategic timeout, digital match hub, fan park, creator matchday, retail take-over, and training ground. Public IPL audience facts are used only as context. Asset reach, conversion, retail lift, rights fees, placement, audience quality, engagement, and outcome fields are synthetic because no private sponsor feed is available.

## Calculation flow

1. **Exposure quality.** The score combines visibility duration, screen placement, audience quality, engagement quality, and normalized conversion quality. Quality-adjusted contacts are modeled asset contacts multiplied by that score. Contacts are not deduplicated across assets.
2. **Media-equivalent value.** Quality-adjusted contacts multiplied by the modeled CPM estimate a media-equivalent exposure value. This is a secondary exposure proxy; it is not cash, contribution profit, or proof of incrementality.
3. **Commercial contribution scenarios.** Direct value uses modeled conversions (stored in thousands) multiplied by an assumed ₹82 contribution per conversion. The assisted-plus-retail case adds modeled assisted response and a retail-uplift contribution proxy. The control-market lift case applies a 58% haircut to the direct and retail response to represent a conservative future treatment/control design.
4. **ROI decision rule.** The primary scenario ROI uses **control-market lift contribution only**: `(modeled control-lift contribution − rights fee) / rights fee`. Media-equivalent value is not blended into commercial contribution. This was corrected because that blend could make exposure value appear to justify renewal even when the incremental contribution scenario does not cover the fee.
5. **Measurement priority.** A high/medium quality band marks assets for a test/measurement priority; a low quality band marks them for renegotiation/hold pending evidence. These bands are score categories, not statistical confidence. No synthetic score can authorize a real renewal, scale, or asset exit.

## Current deterministic output

| Metric | Model result | Interpretation |
|---|---:|---|
| Control-lift contribution proxy | ₹3.67m | Synthetic scenario; not observed sponsor contribution |
| Modeled rights fees | ₹71.7m | Synthetic scenario input |
| Fee coverage | 5.1% | Contribution proxy divided by modeled fee |
| Control-case ROI | −94.9% | Scenario-only ROI; not a real sponsor result |
| Media-equivalent exposure value | ₹641.9m | Secondary exposure proxy; excluded from commercial ROI |
| Modeled quality-adjusted contacts | 14.72bn | Non-deduplicated modeled contacts, not unique people |

The uncertainty routine runs 4,000 deterministic-seed perturbations around simulated control-lift inputs. P10/P50/P90 are −95.3%/−94.9%/−94.5%. These are not confidence intervals, treatment-effect estimates, or forecasts. A live decision should replace them with repeated market-period treatment/control observations and cluster-aware resampling.

## Validation and interpretation limits

- The underlying commercial fields are synthetic, so conclusions are about the model’s decision logic only.
- The modeled market control haircut does not substitute for actual randomization, matched controls, valid pre-trends, or observed outcomes.
- CPM-based media-equivalent value is shown separately and cannot be added to incremental contribution without a defensible value model and clear accounting boundary.
- The quality score is a prioritization heuristic. Its high/medium/low bands are not probability or causal-confidence claims.
- Thresholds of 50% ROI for scale, 15% for renegotiation, and 0% as a test boundary are proposed rules for demonstration, not industry benchmarks.

## Reproducible outputs

| File | Purpose |
|---|---|
| `model/sponsorship_model.py` | Input definitions, formulas, scenario generation, and deterministic perturbation range. |
| `client/src/data/sponsorshipData.ts` | Generated dashboard data. |
| `research/ipl-sponsorship-evidence.md` | Public evidence ledger and methodology guardrails. |
| `docs/executive-memo.md` | Decision recommendation and conditional actions. |
| `docs/measurement-plan.md` | Next-season instrumentation and causal measurement plan. |
| `docs/what-would-change-my-recommendation.md` | Evidence that would change the recommendation. |

## Re-run

From the project root, run `python3 model/sponsorship_model.py`. The script regenerates dashboard data from the documented assumptions and prints the portfolio summary and modeled range.
