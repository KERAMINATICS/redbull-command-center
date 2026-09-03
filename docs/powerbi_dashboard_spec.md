# Power BI Dashboard Specification

## Dashboard title

**Red Bull India Channel and Consumer Growth Dashboard**

Subtitle: *Independent portfolio case study — all performance values simulated; no private Red Bull data used.*

## Data model

Use a simple star schema.

| Table | Grain | Key fields |
|---|---|---|
| FactChannelMonthly | One row per month, channel, city | month, channel, city, units, sales, costs, consumers |
| FactPromotion | One row per month, channel, city | month, channel, city, promotion type, spend |
| FactActivation | One row per activation event | event ID, date, activation, city, attendance, spend, conversion |
| DimDate | One row per date/month | date, month, quarter, year, month number |
| DimChannel | One row per channel | channel, channel group, on/off premise |
| DimCity | One row per modeled city | city, region |
| DimActivation | One row per activation | activation name, event type |

Create one-to-many relationships from dimensions to facts. Keep FactChannelMonthly and FactPromotion at the same dimensional grain or aggregate promotion inputs before loading to avoid accidental many-to-many duplication.

## Core DAX measures

```DAX
Net Sales = SUM(FactChannelMonthly[net_sales_inr])

Units Sold = SUM(FactChannelMonthly[units_sold])

Variable Cost = SUM(FactChannelMonthly[variable_cost_inr])

Marketing Spend = SUM(FactChannelMonthly[marketing_spend_inr])

Contribution Profit = [Net Sales] - [Variable Cost] - [Marketing Spend]

Contribution Margin % = DIVIDE([Contribution Profit], [Net Sales])

Active Consumers = SUM(FactChannelMonthly[active_consumers])

Repeat Consumers = SUM(FactChannelMonthly[repeat_consumers])

Repeat Rate = DIVIDE([Repeat Consumers], [Active Consumers])

New Consumers = SUM(FactChannelMonthly[new_consumers])

CAC Proxy = DIVIDE([Marketing Spend], [New Consumers])

ROAS Proxy = DIVIDE([Net Sales], [Marketing Spend])

Sales per Unit = DIVIDE([Net Sales], [Units Sold])

Availability Rate = AVERAGE(FactChannelMonthly[availability_rate])

Sales Growth % =
VAR CurrentSales = [Net Sales]
VAR PriorSales = CALCULATE([Net Sales], DATEADD(DimDate[date], -12, MONTH))
RETURN DIVIDE(CurrentSales - PriorSales, PriorSales)

Activation Spend = SUM(FactActivation[activation_spend_inr])

Activation Revenue = SUM(FactActivation[attributed_revenue_inr])

Activation Profit ROI % =
DIVIDE(SUM(FactActivation[contribution_profit_inr]) - [Activation Spend], [Activation Spend])

Cost per Conversion = DIVIDE([Activation Spend], SUM(FactActivation[conversions]))
```

## Page 1: Executive summary

Use four KPI cards for net sales, contribution profit, contribution margin, and sales growth. Add a ranked horizontal bar chart for contribution profit by channel. Add a scatter plot with incremental new consumers on the x-axis and modeled incremental profit on the y-axis; size bubbles by retained consumers and color by channel.

Place a text insight box stating: “Under the simulated ₹1 million investment test, Quick commerce ranks first on the blended decision score. This is a modeled recommendation, not actual Red Bull performance.”

## Page 2: Channel performance

Use a matrix with channels as rows and net sales, units, contribution profit, contribution margin, repeat rate, CAC proxy, and availability rate as values. Add a monthly line chart for net sales by channel and a decomposition tree for contribution profit by city and channel. Add slicers for date, city, channel, and channel group.

## Page 3: Consumer growth

Use a stacked column chart for active, repeat, and new consumers by channel. Add a scatter plot of repeat rate versus CAC proxy. Use conditional formatting to flag high-growth/low-repeat channels and low-growth/high-repeat channels. Include a tooltip page with sales per unit and availability rate.

## Page 4: Promotion and availability

Use a line chart for availability rate over time, a column chart for simulated marketing spend, and a table for promotion type, spend, discount intensity, sales, and ROAS proxy. Make the limitations explicit: the model does not identify causal lift from promotions and should not be presented as a validated incrementality study.

## Page 5: Investment scenario

Create a disconnected parameter table for incremental investment with choices such as ₹500,000, ₹1,000,000, and ₹2,000,000. Show modeled incremental revenue, incremental profit, profit ROI, incremental new consumers, and 12-month retained consumers by channel. Add a sensitivity table showing the winner under growth, profitability, and retention priorities.

The default narrative should use the ₹1,000,000 test. The investment-response multipliers are explicit assumptions and should be displayed in a small “Model assumptions” panel.

## Page 6: Sports activation performance model

Use KPI cards for attendance, impressions, leads, conversions, activation spend, base attributed revenue, and profit ROI. Add a funnel from attendance to samples to qualified leads to conversions. Add a bar chart ranking activations by base-case profit ROI and a scenario selector for conservative, base, and upside attribution. Include a table showing cost per attendee, cost per lead, cost per conversion, attributed revenue, and ROI.

## Interactivity and usability

Use a consistent navy, red, white, and neutral-gray theme. Keep all pages filterable by date, city, channel, and activation. Add a reset-filters button. Add a visible “Simulated data” banner on every page. Use report-page tooltips and drillthrough from channel to city detail.

## Transparency controls

Create a text box on the landing page stating that all quantitative values are simulated. Add an `is_simulated` field to the loaded fact tables and use it in a data-quality card. Include a methodology page or appendix in the PBIX explaining the assumptions, response multipliers, attribution factors, and limitations.

## Portfolio screenshot checklist

Capture the executive summary page, the investment scenario page, and the activation page. The screenshot should show the simulated-data subtitle, the selected filters, the top channel, and at least one quantified recommendation. Avoid using Red Bull logos or implying endorsement unless the assets are legally cleared for portfolio use.

## Suggested narrative flow

The report should guide the viewer from “Where is value today?” to “Where is growth accelerating?” to “What happens if we invest?” and finally to “How would sports activation value be measured?” This sequencing demonstrates stakeholder-oriented dashboard design rather than a collection of disconnected charts.
