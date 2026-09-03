# Red Bull India Portfolio Project Brief

## Working title

**Red Bull India Channel and Consumer Growth Dashboard**

## Portfolio positioning

This project is an independent business analytics case study inspired by Red Bull’s publicly visible business model and sports-marketing identity. It does **not** use private Red Bull data, internal systems, confidential customer information, or proprietary performance figures.

The quantitative channel and activation results will be based on a clearly labeled simulated dataset designed for analytical demonstration. Public sources will be used only to establish context, define plausible business dimensions, and anchor publicly verifiable facts.

## Business question

Which route-to-market channel should receive the next increment of growth investment in India, and what evidence would justify that decision?

## Channels in scope

The channel model will compare grocery, convenience, e-commerce, quick commerce, cafés, and sports/events. It will evaluate sales, volume, gross margin, repeat behavior, customer acquisition, distribution or availability, and promotional efficiency.

## Core analytical questions

1. Which channels generate the strongest combination of growth, contribution margin, and repeat purchase?
2. Which channels are efficient for acquiring new consumers versus monetizing existing consumers?
3. Where are there signs of underinvestment, excessive discounting, or operational leakage?
4. Which channel has the highest potential under a constrained incremental-investment scenario?
5. How should the recommendation change if management prioritizes revenue, profit, reach, or consumer recruitment?

## Planned KPIs

| KPI | Definition | Business use |
|---|---|---|
| Net sales | Gross sales less discounts and returns | Measures realized revenue |
| Units sold | Total cans or equivalent units sold | Measures demand volume |
| Net revenue per unit | Net sales divided by units sold | Tracks price and mix |
| Gross margin | Net sales less variable cost | Measures channel economics |
| Contribution margin % | Contribution profit divided by net sales | Enables channel comparison |
| Growth % | Period-over-period change in sales or units | Identifies momentum |
| Repeat purchase rate | Repeat consumers divided by active consumers | Measures retention |
| CAC | Marketing and activation spend divided by new consumers | Measures acquisition efficiency |
| ROAS | Incremental revenue divided by campaign spend | Measures promotional return |
| Distribution/availability | Share of target outlets or digital listings available | Measures execution |
| Incremental profit per ₹ invested | Incremental contribution profit divided by incremental investment | Supports allocation decision |

## Modeling conventions

All simulated monetary values will be expressed in Indian rupees. The model will use monthly observations over a 24-month period so that seasonality, channel momentum, and promotion effects can be demonstrated without presenting the results as actual Red Bull performance.

The dataset will contain a channel fact table, a calendar table, a product or pack table, a geography table, a consumer segment table, a promotion table, and a sports activation table. Every generated table will include a metadata note stating that the values are simulated assumptions.

## Recommendation framework

The primary recommendation will be based on a constrained investment scenario. Each channel will receive an incremental-investment test, and the model will estimate incremental units, sales, contribution profit, new consumers, and payback. The selected channel must win on a clearly stated decision rule rather than on revenue alone.

A sensitivity view will show whether the conclusion changes under three management priorities: growth, profitability, and consumer acquisition.

## Second portfolio project

**Sports Event Activation Performance Model** will connect sports-marketing activity to measurable business value. It will use simulated event-level data with public context references where appropriate. The model will track attendance, qualified engagement, social impressions, content views, sampling, leads, conversion, merchandise demand, sponsorship exposure, spend, attributed revenue, and contribution profit.

The central question will be: **Did the activation create measurable incremental business value after accounting for cost and attribution uncertainty?**

The model will report direct conversion, assisted conversion, cost per engaged attendee, cost per acquired consumer, incremental revenue, incremental contribution profit, media-equivalent value as a secondary metric, and a conservative/base/upside attribution range.

## Planned deliverables

1. A cleaned CSV or Excel data package containing simulated data and a data dictionary.
2. A reproducible analysis workbook or Python analysis output with channel rankings and sensitivities.
3. A Power BI dashboard specification with data model, DAX measures, page layout, filters, and chart recommendations.
4. A portfolio case study in Markdown explaining the business problem, methodology, results, limitations, and recommendation.
5. A short interview-ready explanation of the project and likely stakeholder questions.

## Evidence standard

Public facts will be cited. Simulated values will be labeled in the dashboard subtitle, dataset metadata, README, and case study. No statement will imply that Red Bull supplied, validated, or endorsed the data.

## Suggested dashboard pages

1. Executive summary and channel opportunity ranking.
2. Channel performance and profitability.
3. Consumer growth, repeat, and acquisition.
4. Geography, seasonality, and promotion effectiveness.
5. Incremental investment scenario and sensitivity analysis.
6. Sports activation performance model.

## Success criteria

The finished project should demonstrate business framing, data modeling, KPI design, analytical reasoning, scenario modeling, dashboard communication, responsible handling of simulated data, and the ability to turn analysis into a quantified recommendation.

## Initial technical assumption

The build will target Power BI Desktop using CSV or Excel inputs. If Power BI Desktop is unavailable, the analysis and dashboard layout will still be produced in a portable form that can be recreated in Power BI from the included data package.

## Author disclosure language

> This is an independent portfolio case study. Public information was used for context, while all channel, consumer, financial, and activation performance figures were simulated for demonstration purposes. No private or confidential Red Bull data was used.

## References

References will be added after the public-source research phase and will support only contextual claims, not the simulated performance outputs.

## Author

Manus AI

## Date

25 August 2026

## Status

Scope approved for dataset construction and public-source research.

> Note: The project is designed to demonstrate analytical method and decision quality, not to claim actual Red Bull India performance.

## Next phase input list

The next phase will require: public company/context sources, a simulated channel schema, a simulated sports activation schema, assumptions for pricing/cost/promotion/seasonality, and a data dictionary suitable for Power BI.

## Parallel workstreams for the next phase

- Public context and source collection.
- Channel and consumer dataset design.
- Sports activation dataset design.
- Assumption register and data dictionary.
