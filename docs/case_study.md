# Red Bull India Channel and Consumer Growth Dashboard

## Independent portfolio case study

> This is an independent portfolio case study. Public information was used for context, while all channel, consumer, financial, and activation performance figures were simulated for demonstration purposes. No private or confidential Red Bull data was used.

## Executive summary

The business question is: **Which route-to-market channel should receive the next increment of growth investment in India, and what evidence would justify that decision?**

The case study models six channels—grocery, convenience, e-commerce, quick commerce, cafés, and sports/events—across six Indian cities and 24 months. The modeled data is intentionally synthetic and reproducible. It is not a forecast, an estimate of Red Bull’s actual performance, or evidence supplied by the company.

In the simulated base case, **convenience** produces the highest total contribution profit at approximately ₹281.8 million and a 42.1% contribution margin. **Quick commerce** is the fastest-growing channel, with modeled sales increasing 81.9% between the first six months and the last six months. When the model tests a ₹1.0 million incremental investment and scores each channel on profit ROI, new-consumer acquisition, and 12-month retention, **quick commerce ranks first**. The modeled response is ₹1.18 million incremental revenue, ₹391,591 incremental contribution profit, and 39.2% incremental profit ROI.

The recommendation is therefore to use quick commerce as the **incremental growth bet**, while protecting convenience and grocery as scale and availability foundations. The recommendation is conditional on the assumptions and should be validated with actual sell-through, margin, availability, promotion, and cohort data before a real investment decision.

## Why this is a credible business context

Red Bull’s official company profile describes the brand as having launched its Energy Drink in Austria in 1987 and reports global company facts such as countries served, employees, cans sold, and turnover.[1] Red Bull’s India location page states that the Indian business launched in 2009 and describes sales coverage across supermarkets, convenience stores, gas stations, cafés, restaurants, bars, e-commerce, hotels, festivals, and specialty retailers.[2] The same page describes an operating distinction between **Off Premise** retail consumption later and **On Premise** hospitality consumption immediately, which informs the channel architecture used in this portfolio model.[2]

The India page also describes sports, culture, brand, consumer activation, and media teams, while Red Bull’s official support hub provides public categories for events, athletes, gaming, artists, ticketing, merchandise, and sponsorship.[2] [3] These public descriptions support the choice to connect channel economics with an activation-performance model, but they do not provide the simulated results in this project.

## Data and methodology

The model uses monthly observations from January 2024 through December 2025. It contains 864 channel-city-month records and 24 sports activation records. The synthetic generator uses a fixed random seed so that the data can be regenerated consistently.

| Component | Treatment in this project |
|---|---|
| Sales and volume | Simulated units, list sales, discounts, and net sales |
| Costs | Simulated variable cost and marketing spend |
| Consumers | Simulated active, repeat, and new consumers |
| Execution | Simulated outlets/listings and availability rate |
| Growth scenario | Explicit response multipliers applied to a ₹1.0 million test investment |
| Activation value | Simulated attendance, impressions, leads, conversions, spend, attributed revenue, and contribution profit |
| Attribution | Conservative, base, and upside factors of 50%, 100%, and 135% |

The channel decision score weights modeled profit ROI at 50%, incremental new consumers at 30%, and estimated 12-month retained consumers at 20%. This weighting is a portfolio assumption designed to make the decision rule transparent.

## Channel findings

| Channel | Modeled net sales | Modeled contribution profit | Contribution margin | Sales growth, first six months to last six months | Repeat rate | CAC proxy |
|---|---:|---:|---:|---:|---:|---:|
| Convenience | ₹669.4m | ₹281.8m | 42.1% | 37.3% | 47.9% | ₹56.79 |
| Quick commerce | ₹449.9m | ₹149.3m | 33.2% | **81.9%** | 45.7% | **₹39.17** |
| Grocery | ₹409.9m | ₹143.4m | 35.0% | 30.1% | 41.8% | ₹49.27 |
| Cafés | ₹262.3m | ₹118.2m | **45.1%** | 29.1% | **55.0%** | ₹121.03 |
| E-commerce | ₹337.4m | ₹112.0m | 33.2% | 56.9% | 50.1% | ₹47.99 |
| Sports/events | ₹176.1m | ₹75.3m | 42.8% | 48.4% | 36.1% | ₹49.91 |

The table demonstrates why channel selection should not be based on a single KPI. Convenience leads on modeled contribution profit because it combines scale and favorable economics. Cafés lead on modeled margin and repeat rate but have a higher acquisition-cost proxy. Quick commerce has the strongest growth and lowest acquisition-cost proxy in the synthetic dataset, making it the most compelling incremental-growth candidate.

## Incremental investment recommendation

The model applies a ₹1.0 million test budget to each channel. The response multipliers are explicit assumptions: quick commerce receives the highest modeled revenue response because it is assumed to benefit from digital discoverability, immediacy, and targeted promotions. The output is a decision simulation rather than a causal estimate.

| Channel | Incremental revenue | Incremental contribution profit | Profit ROI | Incremental new consumers | 12-month retained consumers |
|---|---:|---:|---:|---:|---:|
| Quick commerce | **₹1.18m** | **₹391,591** | **39.2%** | 25,527 | 11,232 |
| E-commerce | ₹1.02m | ₹338,481 | 33.8% | 20,838 | 9,585 |
| Convenience | ₹720k | ₹303,101 | 30.3% | 17,607 | 7,395 |
| Cafés | ₹630k | ₹283,881 | 28.4% | 8,262 | 4,214 |
| Grocery | ₹550k | ₹192,442 | 19.2% | 20,296 | 7,307 |
| Sports/events | ₹480k | ₹205,315 | 20.5% | 20,036 | 6,011 |

### Recommendation

**Prioritize quick commerce for a controlled incremental-growth pilot, with convenience and grocery retained as distribution and scale foundations.** A credible real-world pilot would define a test-market/control-market design, protect contribution margin, measure availability and search visibility, track first-to-second purchase conversion, and stop or redesign the investment if incremental profit or retention falls below the agreed threshold.

This recommendation is supported by three modeled signals: the fastest sales growth at 81.9%, the lowest acquisition-cost proxy at ₹39.17, and the highest incremental profit ROI at 39.2% under the ₹1.0 million scenario. The dashboard should make clear that these signals are outputs of simulated assumptions and require validation against actual data.

## Sports Event Activation Performance Model

The second project measures whether a sports, gaming, culture, or campus activation generated business value. It follows a funnel from attendance to engagement, samples, qualified leads, conversions, attributed revenue, and contribution profit. Red Bull’s public India page references sports, culture, consumer activation, and media roles, and gives examples of local projects such as Campus Cricket, Jod Ke Tod, Red Bull Basement, and BC One.[2] The project uses these themes for contextual inspiration, not as a claim about actual event performance.

The synthetic activation file includes 24 events across six activation concepts. It reports event attendance, social impressions, content views, samples, qualified leads, conversions, spend, attributed revenue, and contribution profit. Attribution is stress-tested across conservative, base, and upside cases.

The model currently shows a deliberately important analytical lesson: direct attributed revenue alone is insufficient to justify the modeled event spend. In the base case, event spend is much larger than directly attributed revenue, producing negative direct-profit ROI across the activation concepts. This does not prove that real sports activations destroy value; it shows that a real measurement framework must include incrementality, assisted conversion, earned reach, brand lift, retail sell-through, and longer-term consumer value rather than only immediate conversion revenue.

| Activation concept | Attendance | Qualified leads | Conversions | Spend | Base attributed revenue | Direct-profit ROI |
|---|---:|---:|---:|---:|---:|---:|
| Music & Culture Night | 39,607 | 3,625 | 397 | ₹6.60m | ₹0.22m | -98.7% |
| Campus Cricket | 31,120 | 3,016 | 623 | ₹9.66m | ₹0.34m | -98.8% |
| Gaming Community Finals | 26,339 | 2,087 | 420 | ₹7.34m | ₹0.23m | -98.9% |
| Urban Dance Showcase | 33,103 | 3,332 | 476 | ₹6.01m | ₹0.23m | -98.9% |
| Adventure Team Challenge | 33,330 | 1,668 | 311 | ₹7.64m | ₹0.17m | -99.2% |
| City Run Experience | 26,674 | 2,133 | 349 | ₹10.64m | ₹0.22m | -99.3% |

### Measurement recommendation

For a real activation, evaluate business value using a matched control or geo-lift design wherever possible. Link attendee identifiers or consented QR interactions to later purchase behavior, distinguish direct from assisted conversions, and report value in a conservative/base/upside range. Media-equivalent value can be shown as a secondary awareness indicator, but it should not be substituted for incremental profit without a clear methodology.

## Advanced analytics layer

To move beyond surface-level reporting, the project adds five analytical components. First, a time-aware forecast benchmark compares a prior-year seasonal-naive model with a Random Forest using a six-month out-of-time holdout. On the simulated data, the Random Forest achieves MAE of approximately 10,585 units versus 30,104 for the seasonal-naive benchmark, and RMSE of approximately 15,828 versus 35,753. This supports its use as a planning benchmark, not as causal evidence.

Second, K-means clustering creates city-channel archetypes using modeled sales, profit, growth, repeat rate, acquisition-cost proxy, availability, and new consumers. The resulting labels are intentionally interpreted as commercial profiles such as scale and profit, high-growth acquisition, retention-led, and efficiency watch. They are not claimed to be true consumer segments because the dataset is aggregated rather than customer-level.

Third, the project includes a hypothetical difference-in-differences design for a quick-commerce pilot. Three modeled cities are assigned to treatment and the remaining cities to control after a simulated intervention date. The resulting incremental-units estimate is clearly marked as a design demonstration only. A real test would require randomization or matched markets, pre-period parallel-trends testing, contamination controls, and confidence intervals.

Fourth, activation ROI is bootstrapped 2,000 times under conservative, base, and upside attribution cases. The modeled mean ROI remains approximately -99% across all three cases, with zero probability of positive ROI in the synthetic sample. This result is used as a measurement warning: direct conversion attribution is not sufficient to scale an activation, and the next version must add causal lift, assisted conversion, retail sell-through, brand lift, and longer-term consumer value.

Fifth, an AI-assisted insight workflow uses a smaller model to draft an evidence-grounded narrative and a stronger reasoning model to critique it. The models are given computed tables, not unverified claims. The reviewer is instructed to separate descriptive association, predictive accuracy, scenario assumptions, and causal evidence. AI output is saved as structured JSON and remains subject to human review.

## Dashboard design

The Power BI report should contain six pages: executive summary, channel performance, consumer growth, promotion and availability, investment scenario, and sports activation performance. Each page should contain a visible simulated-data banner. The dashboard specification in the accompanying file defines the star schema, relationships, DAX measures, page layouts, filters, tooltips, and transparency controls.

The executive page should answer “where is value today?” The channel page should answer “what explains the value?” The consumer page should answer “who is being acquired and retained?” The investment page should answer “what happens if we invest?” The activation page should answer “how would we measure sports-marketing value?” This narrative sequence is designed to demonstrate stakeholder-oriented analytics communication.

## Limitations and responsible use

The dataset is not actual Red Bull data. The model does not include real distributor sell-in, retailer sell-through, inventory, price architecture, trade terms, media exposures, consumer-panel data, or validated causal experiments. The city list, channel economics, response multipliers, retention rates, and activation attribution factors are modeled assumptions. The project should therefore be presented as an **analytical prototype** that demonstrates how a business analyst would structure the problem and communicate a decision.

Avoid using Red Bull logos or branded creative assets unless the portfolio platform permits the use and the assets are properly cleared. The safest presentation is a text-led, independently branded dashboard with the disclosure visible on the landing page and in the README.

## Interview-ready explanation

> I built an independent Red Bull India channel-growth prototype using a transparent synthetic dataset. I modeled six channels over 24 months, created contribution, repeat, CAC, availability, and growth KPIs, and tested a ₹1 million incremental-investment scenario. Convenience led on total modeled profit, but quick commerce led on growth, acquisition efficiency, and modeled incremental profit ROI, so I recommended a controlled quick-commerce pilot while protecting convenience and grocery fundamentals. I also built a sports-activation model that separates attendance and engagement from attributable revenue and tests conservative, base, and upside attribution. The key analytical judgment was to state clearly what the data can and cannot prove.

## References

[1]: https://www.redbull.com/int-en/energydrink/company-profile "Red Bull Company Profile — Red Bull"
[2]: https://jobs.redbull.com/in-en/locations/red-bull-india?lang=en "Red Bull India — Official Careers and Location Page"
[3]: https://www.redbull.com/us-en/support-hub/athletes-and-events "Athletes & Events — Red Bull Support Hub"
