from pathlib import Path
import pandas as pd
import numpy as np

BASE = Path(__file__).resolve().parents[1] / 'data'
OUT = BASE
ch = pd.read_csv(BASE/'channel_monthly.csv', parse_dates=['month'])
ev = pd.read_csv(BASE/'sports_activation_events.csv', parse_dates=['event_date'])

ch['contribution_profit_inr'] = ch['net_sales_inr'] - ch['variable_cost_inr'] - ch['marketing_spend_inr']
ch['contribution_margin_pct'] = ch['contribution_profit_inr'] / ch['net_sales_inr']
ch['repeat_rate'] = ch['repeat_consumers'] / ch['active_consumers']
ch['new_consumer_rate'] = ch['new_consumers'] / ch['active_consumers']
ch['sales_per_unit_inr'] = ch['net_sales_inr'] / ch['units_sold']

summary = ch.groupby('channel', as_index=False).agg(
    net_sales_inr=('net_sales_inr','sum'), units_sold=('units_sold','sum'),
    contribution_profit_inr=('contribution_profit_inr','sum'), marketing_spend_inr=('marketing_spend_inr','sum'),
    active_consumers=('active_consumers','sum'), repeat_consumers=('repeat_consumers','sum'),
    new_consumers=('new_consumers','sum'), availability_rate=('availability_rate','mean'))
summary['contribution_margin_pct'] = summary['contribution_profit_inr'] / summary['net_sales_inr']
summary['repeat_rate'] = summary['repeat_consumers'] / summary['active_consumers']
summary['new_consumer_rate'] = summary['new_consumers'] / summary['active_consumers']
summary['roas_proxy'] = summary['net_sales_inr'] / summary['marketing_spend_inr']
summary['cac_proxy_inr'] = summary['marketing_spend_inr'] / summary['new_consumers']
summary['profit_per_marketing_rupee'] = summary['contribution_profit_inr'] / summary['marketing_spend_inr']

# Growth from first six months to last six months.
first = ch[ch['month'] < '2024-07-01'].groupby('channel')['net_sales_inr'].mean()
last = ch[ch['month'] >= '2025-07-01'].groupby('channel')['net_sales_inr'].mean()
summary['sales_growth_first6_to_last6_pct'] = summary['channel'].map((last/first-1)*100)

# Incremental investment scenario: each channel gets 1,000,000 INR; response rates are explicit assumptions.
response = {'Grocery':0.55, 'Convenience':0.72, 'E-commerce':0.86, 'Quick commerce':1.18, 'Cafés':0.63, 'Sports/events':0.48}
retention = {'Grocery':0.36, 'Convenience':0.42, 'E-commerce':0.46, 'Quick commerce':0.44, 'Cafés':0.51, 'Sports/events':0.30}
scenario = summary[['channel','contribution_margin_pct','cac_proxy_inr']].copy()
scenario['incremental_investment_inr'] = 1_000_000
scenario['incremental_revenue_multiple'] = scenario['channel'].map(response)
scenario['incremental_revenue_inr'] = scenario['incremental_investment_inr'] * scenario['incremental_revenue_multiple']
scenario['incremental_profit_inr'] = scenario['incremental_revenue_inr'] * scenario['contribution_margin_pct']
scenario['incremental_new_consumers'] = scenario['incremental_investment_inr'] / scenario['cac_proxy_inr']
scenario['estimated_12m_retained_consumers'] = scenario['incremental_new_consumers'] * scenario['channel'].map(retention)
scenario['profit_roi_pct'] = (scenario['incremental_profit_inr'] / scenario['incremental_investment_inr']) * 100
scenario['decision_score'] = 0.5 * (scenario['profit_roi_pct'] / scenario['profit_roi_pct'].max()) + 0.3 * (scenario['incremental_new_consumers'] / scenario['incremental_new_consumers'].max()) + 0.2 * (scenario['estimated_12m_retained_consumers'] / scenario['estimated_12m_retained_consumers'].max())
scenario = scenario.sort_values('decision_score', ascending=False)

# Sensitivity by management priority.
sens = scenario[['channel','incremental_profit_inr','incremental_new_consumers','estimated_12m_retained_consumers']].copy()
sens['growth_priority_score'] = sens['incremental_new_consumers'] / sens['incremental_new_consumers'].max()
sens['profit_priority_score'] = sens['incremental_profit_inr'] / sens['incremental_profit_inr'].max()
sens['retention_priority_score'] = sens['estimated_12m_retained_consumers'] / sens['estimated_12m_retained_consumers'].max()

# Activation economics.
ev['cost_per_attendee_inr'] = ev['activation_spend_inr'] / ev['attendance']
ev['cost_per_lead_inr'] = ev['activation_spend_inr'] / ev['qualified_leads']
ev['cost_per_conversion_inr'] = ev['activation_spend_inr'] / ev['conversions'].replace(0, np.nan)
ev['base_roas'] = ev['attributed_revenue_inr'] / ev['activation_spend_inr']
ev['base_profit_roi_pct'] = (ev['contribution_profit_inr'] / ev['activation_spend_inr']) * 100
for case, factor in [('conservative',0.50),('base',1.00),('upside',1.35)]:
    ev[f'{case}_attributed_revenue_inr'] = ev['attributed_revenue_inr'] * factor
    ev[f'{case}_profit_inr'] = ev[f'{case}_attributed_revenue_inr'] * (ev['contribution_profit_inr'] / ev['attributed_revenue_inr'].replace(0,np.nan)) - ev['activation_spend_inr']
    ev[f'{case}_roi_pct'] = ev[f'{case}_profit_inr'] / ev['activation_spend_inr'] * 100
activation_summary = ev.groupby('activation_name', as_index=False).agg(
    events=('event_id','count'), attendance=('attendance','sum'), impressions=('social_impressions','sum'),
    leads=('qualified_leads','sum'), conversions=('conversions','sum'), spend_inr=('activation_spend_inr','sum'),
    base_revenue_inr=('attributed_revenue_inr','sum'), base_profit_inr=('contribution_profit_inr','sum'))
activation_summary['base_profit_roi_pct'] = (activation_summary['base_profit_inr'] - activation_summary['spend_inr']) / activation_summary['spend_inr'] * 100
activation_summary['cost_per_conversion_inr'] = activation_summary['spend_inr'] / activation_summary['conversions']

summary.sort_values('contribution_profit_inr', ascending=False).to_csv(OUT/'channel_summary.csv', index=False)
scenario.to_csv(OUT/'investment_scenario.csv', index=False)
sens.to_csv(OUT/'sensitivity_scores.csv', index=False)
ev.to_csv(OUT/'sports_activation_scored.csv', index=False)
activation_summary.sort_values('base_profit_roi_pct', ascending=False).to_csv(OUT/'activation_summary.csv', index=False)

# Text results for easy use in the case study.
top_profit = summary.sort_values('contribution_profit_inr', ascending=False).iloc[0]
top_scenario = scenario.iloc[0]
top_growth = summary.sort_values('sales_growth_first6_to_last6_pct', ascending=False).iloc[0]
report = f'''# Analysis results\n\nAll results below are based on simulated assumptions and are not actual Red Bull performance.\n\n## Channel summary\n\nThe largest modeled contribution-profit channel is **{top_profit.channel}**, with simulated contribution profit of ₹{top_profit.contribution_profit_inr:,.0f} and contribution margin of {top_profit.contribution_margin_pct:.1%}.\n\nThe fastest modeled sales growth from the first six months to the last six months is **{top_growth.channel}**, at {top_growth.sales_growth_first6_to_last6_pct:.1f}%.\n\nUnder a ₹1,000,000 incremental investment test and a blended decision score weighting profit ROI, acquisition, and 12-month retention, **{top_scenario.channel}** ranks first. Its modeled incremental revenue is ₹{top_scenario.incremental_revenue_inr:,.0f}, incremental contribution profit is ₹{top_scenario.incremental_profit_inr:,.0f}, and profit ROI is {top_scenario.profit_roi_pct:.1f}%.\n\n## Interpretation\n\nThe recommended portfolio narrative is to prioritize the top-ranked channel for incremental growth investment while using grocery and convenience as availability and scale foundations. The recommendation should be presented as a decision produced by the assumptions, not as a claim about Red Bull’s real channel economics.\n\n## Activation model\n\nActivation performance is evaluated using attendance, engagement, social impressions, leads, conversions, attributed revenue, spend, and contribution profit. The conservative, base, and upside cases apply explicit attribution factors of 50%, 100%, and 135% to the base attributed revenue assumption.\n'''
(OUT/'analysis_results.md').write_text(report)
print(report)
print('Top scenario:', top_scenario.channel)
