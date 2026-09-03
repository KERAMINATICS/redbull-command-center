from pathlib import Path
import numpy as np
import pandas as pd

OUT = Path(__file__).resolve().parents[1] / 'data'
OUT.mkdir(exist_ok=True)
rng = np.random.default_rng(42)

months = pd.date_range('2024-01-01', '2025-12-01', freq='MS')
channels = {
    'Grocery': {'base': 21000, 'price': 125, 'vcost': 68, 'growth': 0.010, 'repeat': 0.42, 'new_rate': 0.15, 'promo': 0.10},
    'Convenience': {'base': 28000, 'price': 145, 'vcost': 72, 'growth': 0.014, 'repeat': 0.48, 'new_rate': 0.13, 'promo': 0.08},
    'E-commerce': {'base': 15000, 'price': 138, 'vcost': 70, 'growth': 0.022, 'repeat': 0.50, 'new_rate': 0.18, 'promo': 0.17},
    'Quick commerce': {'base': 17000, 'price': 150, 'vcost': 74, 'growth': 0.030, 'repeat': 0.46, 'new_rate': 0.21, 'promo': 0.20},
    'Cafés': {'base': 9000, 'price': 175, 'vcost': 82, 'growth': 0.012, 'repeat': 0.55, 'new_rate': 0.11, 'promo': 0.05},
    'Sports/events': {'base': 6000, 'price': 160, 'vcost': 78, 'growth': 0.018, 'repeat': 0.36, 'new_rate': 0.29, 'promo': 0.03},
}
cities = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai']
city_factor = {'Mumbai': 1.12, 'Delhi NCR': 1.08, 'Bengaluru': 1.16, 'Hyderabad': 0.92, 'Pune': 0.88, 'Chennai': 0.84}
seasonality = {1:0.90, 2:0.92, 3:1.00, 4:1.05, 5:1.15, 6:1.12, 7:1.08, 8:1.03, 9:1.00, 10:1.12, 11:1.20, 12:1.10}

rows = []
for month_idx, month in enumerate(months):
    for channel, p in channels.items():
        for city in cities:
            trend = (1 + p['growth']) ** month_idx
            promo_intensity = max(0, min(0.35, p['promo'] + rng.normal(0, 0.025)))
            units = p['base'] * trend * seasonality[month.month] * city_factor[city] * rng.normal(1, 0.055)
            units = int(max(500, units))
            list_sales = units * p['price']
            discount = list_sales * promo_intensity
            net_sales = list_sales - discount
            variable_cost = units * p['vcost']
            marketing_spend = net_sales * (0.025 + 0.035 * promo_intensity) + rng.uniform(25000, 90000)
            active_consumers = int(units / (1.25 + 0.25 * p['repeat']) * rng.normal(1, 0.04))
            repeat_consumers = int(active_consumers * p['repeat'] * rng.normal(1, 0.035))
            new_consumers = int(active_consumers * p['new_rate'] * rng.normal(1, 0.05))
            outlets = int((units / 420) * rng.normal(1, 0.08)) if channel not in ['E-commerce','Quick commerce'] else int((units / 700) * rng.normal(1,0.08))
            available = min(0.99, max(0.55, 0.62 + 0.012 * month_idx + rng.normal(0, 0.025)))
            rows.append({
                'month': month, 'channel': channel, 'city': city, 'units_sold': units,
                'list_sales_inr': round(list_sales,2), 'discounts_inr': round(discount,2),
                'net_sales_inr': round(net_sales,2), 'variable_cost_inr': round(variable_cost,2),
                'marketing_spend_inr': round(marketing_spend,2), 'active_consumers': active_consumers,
                'repeat_consumers': repeat_consumers, 'new_consumers': new_consumers,
                'outlets_or_listings': max(20, outlets), 'availability_rate': round(available,4),
                'is_simulated': True, 'data_note': 'Simulated assumption; not Red Bull private data'
            })
channel_df = pd.DataFrame(rows)
channel_df.to_csv(OUT/'channel_monthly.csv', index=False)

# Promotion table at month/channel level for Power BI relationships.
promo = channel_df[['month','channel','city','discounts_inr','marketing_spend_inr']].copy()
promo['promotion_type'] = np.select(
    [promo['channel'].eq('Quick commerce'), promo['channel'].eq('E-commerce'), promo['channel'].eq('Sports/events')],
    ['instant discount / app visibility','bundle / search placement','sampling / event activation'], default='trade visibility / display')
promo['promo_days'] = rng.integers(3, 16, len(promo))
promo['is_simulated'] = True
promo.to_csv(OUT/'promotion_detail.csv', index=False)

# Activation model: event-level simulated observations.
activation_names = ['Campus Cricket','Urban Dance Showcase','Adventure Team Challenge','Gaming Community Finals','Music & Culture Night','City Run Experience']
events = []
for i in range(24):
    name = activation_names[i % len(activation_names)]
    city = cities[i % len(cities)]
    event_date = months[i % len(months)] + pd.Timedelta(days=int(rng.integers(3, 25)))
    attendance = int(rng.integers(1200, 12000))
    engagement_rate = rng.uniform(0.28, 0.62)
    social_impressions = int(attendance * rng.uniform(18, 48))
    content_views = int(social_impressions * rng.uniform(0.12, 0.34))
    samples = int(attendance * rng.uniform(0.42, 0.90))
    leads = int(samples * rng.uniform(0.06, 0.18))
    conversion_rate = rng.uniform(0.08, 0.24)
    conversions = int(leads * conversion_rate)
    avg_order_value = rng.uniform(380, 760)
    attributed_revenue = conversions * avg_order_value
    spend = rng.uniform(650000, 3200000)
    contribution_profit = attributed_revenue * rng.uniform(0.28, 0.42)
    events.append({
        'event_id': f'EVT-{i+1:03d}', 'event_date': event_date, 'activation_name': name,
        'city': city, 'attendance': attendance, 'engagement_rate': round(engagement_rate,4),
        'social_impressions': social_impressions, 'content_views': content_views,
        'samples_distributed': samples, 'qualified_leads': leads, 'conversions': conversions,
        'conversion_rate': round(conversion_rate,4), 'avg_order_value_inr': round(avg_order_value,2),
        'attributed_revenue_inr': round(attributed_revenue,2), 'activation_spend_inr': round(spend,2),
        'contribution_profit_inr': round(contribution_profit,2),
        'attribution_case': 'Base case; simulated assumptions; not Red Bull private data',
        'is_simulated': True
    })
activation_df = pd.DataFrame(events)
activation_df.to_csv(OUT/'sports_activation_events.csv', index=False)

# Metadata and data dictionary.
metadata = '''# Dataset metadata\n\nAll quantitative values in this folder are **simulated assumptions** created for an independent portfolio case study. They do not represent actual Red Bull India performance and were not supplied or validated by Red Bull. The random seed is 42 so the data can be regenerated reproducibly. Monetary values are in Indian rupees.\n\nPublic context sources: Red Bull’s official company profile, Red Bull India careers/location page, and Red Bull’s official Athletes & Events support page. These sources are used for business context only.\n'''
(OUT/'README.md').write_text(metadata)

data_dict = pd.DataFrame([
    ['channel_monthly.csv','month','Month start date','Date'],
    ['channel_monthly.csv','channel','Route-to-market channel','Category'],
    ['channel_monthly.csv','city','Modeled Indian city/market','Category'],
    ['channel_monthly.csv','units_sold','Simulated units sold','Whole number'],
    ['channel_monthly.csv','net_sales_inr','List sales less simulated discounts','Currency'],
    ['channel_monthly.csv','variable_cost_inr','Simulated variable cost','Currency'],
    ['channel_monthly.csv','marketing_spend_inr','Simulated trade/marketing spend','Currency'],
    ['channel_monthly.csv','active_consumers','Estimated active consumers in model','Whole number'],
    ['channel_monthly.csv','repeat_consumers','Estimated repeat consumers in model','Whole number'],
    ['channel_monthly.csv','new_consumers','Estimated new consumers in model','Whole number'],
    ['channel_monthly.csv','availability_rate','Modeled availability/listing rate','Percentage'],
    ['sports_activation_events.csv','attendance','Simulated event attendance','Whole number'],
    ['sports_activation_events.csv','social_impressions','Simulated social impressions','Whole number'],
    ['sports_activation_events.csv','qualified_leads','Simulated qualified leads','Whole number'],
    ['sports_activation_events.csv','conversions','Simulated conversions','Whole number'],
    ['sports_activation_events.csv','attributed_revenue_inr','Base-case simulated attributed revenue','Currency'],
    ['sports_activation_events.csv','activation_spend_inr','Simulated activation spend','Currency'],
    ['sports_activation_events.csv','contribution_profit_inr','Base-case simulated contribution profit','Currency'],
], columns=['file','field','description','data_type'])
data_dict.to_csv(OUT/'data_dictionary.csv', index=False)
print(f'Created {len(channel_df):,} channel rows and {len(activation_df):,} activation rows in {OUT}')
