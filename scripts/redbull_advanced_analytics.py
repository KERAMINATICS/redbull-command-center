from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from statsmodels.tsa.holtwinters import ExponentialSmoothing

BASE = Path(__file__).resolve().parents[1] / 'data'
OUT = Path(__file__).resolve().parents[1] / 'advanced_outputs'; OUT.mkdir(exist_ok=True)
rng = np.random.default_rng(42)
ch = pd.read_csv(BASE/'channel_monthly.csv', parse_dates=['month'])
ev = pd.read_csv(BASE/'sports_activation_events.csv', parse_dates=['event_date'])
ch['contribution_profit_inr'] = ch['net_sales_inr'] - ch['variable_cost_inr'] - ch['marketing_spend_inr']
ch['repeat_rate'] = ch['repeat_consumers'] / ch['active_consumers']
ch['cac_proxy_inr'] = ch['marketing_spend_inr'] / ch['new_consumers']

# 1. Forecasting: rolling holdout by channel, with a simple seasonal exponential-smoothing baseline.
forecast_rows, metric_rows = [], []
for channel, g in ch.groupby('channel'):
    s = g.groupby('month')['units_sold'].sum().sort_index()
    train, test = s.iloc[:-6], s.iloc[-6:]
    if len(train) >= 24:
        model = ExponentialSmoothing(train, trend='add', seasonal='add', seasonal_periods=12, initialization_method='estimated').fit(optimized=True)
        pred = model.forecast(6)
        model_name = 'Holt-Winters additive trend/seasonality'
    else:
        # Six-month holdout leaves 18 months; use a transparent prior-year seasonal baseline.
        pred = pd.Series([train.iloc[-6 + i] if len(train) >= 12 else train.iloc[-1] for i in range(6)], index=test.index)
        model_name = 'Prior-year seasonal naive fallback'
    for dt, actual, fitted in zip(test.index, test.values, pred.values):
        forecast_rows.append({'channel':channel,'month':dt,'actual_units':actual,'forecast_units':fitted,'is_simulated':True})
    metric_rows.append({'channel':channel,'model':model_name,'holdout_months':6,'MAE':mean_absolute_error(test,pred),'RMSE':mean_squared_error(test,pred)**0.5,'MAPE_pct':np.mean(np.abs((test-pred)/test))*100})
pd.DataFrame(forecast_rows).to_csv(OUT/'forecast_holdout.csv',index=False)
pd.DataFrame(metric_rows).to_csv(OUT/'forecast_metrics.csv',index=False)

# 2. Segmentation: aggregate city-channel profiles and cluster into interpretable growth archetypes.
profile = ch.groupby(['city','channel'],as_index=False).agg(
    sales=('net_sales_inr','sum'), profit=('contribution_profit_inr','sum'),
    growth=('net_sales_inr',lambda x: (x.iloc[-1]-x.iloc[0])/x.iloc[0]),
    repeat_rate=('repeat_rate','mean'), cac=('cac_proxy_inr','mean'), availability=('availability_rate','mean'),
    new_consumers=('new_consumers','sum'))
features = profile[['sales','profit','growth','repeat_rate','cac','availability','new_consumers']]
X = StandardScaler().fit_transform(features)
km = KMeans(n_clusters=4, random_state=42, n_init=20).fit(X)
profile['segment_id'] = km.labels_
centers = profile.groupby('segment_id')[['sales','profit','growth','repeat_rate','cac','availability','new_consumers']].mean().reset_index()
# Rank cluster labels by practical business interpretation.
centers['segment_label'] = centers.apply(lambda r: 'Scale & profit' if r['profit']==centers['profit'].max() else ('High-growth acquisition' if r['growth']==centers['growth'].max() else ('Retention-led' if r['repeat_rate']==centers['repeat_rate'].max() else 'Efficiency watch')),axis=1)
profile = profile.merge(centers[['segment_id','segment_label']],on='segment_id')
profile.to_csv(OUT/'city_channel_segments.csv',index=False); centers.to_csv(OUT/'segment_profiles.csv',index=False)

# 3. Predictive benchmark: time-aware random forest vs naive seasonal baseline.
monthly = ch.groupby(['month','channel'],as_index=False).agg(units_sold=('units_sold','sum'), availability_rate=('availability_rate','mean'), marketing_spend=('marketing_spend_inr','sum'), discounts=('discounts_inr','sum'))
monthly['month_num'] = monthly['month'].dt.month
monthly['time_idx'] = (monthly['month'].dt.year-2024)*12 + monthly['month'].dt.month
monthly = pd.get_dummies(monthly, columns=['channel'], dtype=int)
feature_cols = ['availability_rate','marketing_spend','discounts','month_num','time_idx'] + [c for c in monthly.columns if c.startswith('channel_')]
train = monthly[monthly['month'] < '2025-07-01']; test = monthly[monthly['month'] >= '2025-07-01']
rf = RandomForestRegressor(n_estimators=300, max_depth=8, random_state=42, min_samples_leaf=2)
rf.fit(train[feature_cols], train['units_sold']); pred = rf.predict(test[feature_cols])
# Baseline uses prior-year same-month units by matching month/channel dummy row.
base_lookup = train.set_index(['time_idx']+ [c for c in monthly.columns if c.startswith('channel_')])['units_sold']
# Easier baseline: global median seasonal ratio from train, compared to last available year by row ordering.
naive = []
for _, r in test.iterrows():
    prior = monthly[(monthly['time_idx']==r['time_idx']-12) & (monthly[[c for c in monthly.columns if c.startswith('channel_')]].eq(r[[c for c in monthly.columns if c.startswith('channel_')]]).all(axis=1))]
    naive.append(float(prior['units_sold'].iloc[0]) if len(prior) else train['units_sold'].median())
bench = pd.DataFrame([{'model':'RandomForest','MAE':mean_absolute_error(test['units_sold'],pred),'RMSE':mean_squared_error(test['units_sold'],pred)**0.5},{'model':'Prior-year seasonal naive','MAE':mean_absolute_error(test['units_sold'],naive),'RMSE':mean_squared_error(test['units_sold'],naive)**0.5}])
bench.to_csv(OUT/'predictive_benchmark.csv',index=False)

# 4. Difference-in-differences design simulation for quick-commerce pilot.
# This is a hypothetical test design layered on top of the synthetic data, not observed treatment data.
qc = ch[ch['channel']=='Quick commerce'].groupby(['month','city'],as_index=False)['units_sold'].sum()
treated = ['Mumbai','Bengaluru','Pune']
qc['treated'] = qc['city'].isin(treated).astype(int); qc['post'] = (qc['month'] >= '2025-01-01').astype(int); qc['interaction'] = qc['treated']*qc['post']
pre = qc[qc['post']==0].groupby('treated')['units_sold'].mean(); post = qc[qc['post']==1].groupby('treated')['units_sold'].mean()
did = (post[1]-pre[1]) - (post[0]-pre[0])
did_out = pd.DataFrame([{'design':'Hypothetical quick-commerce geo pilot','treated_cities':', '.join(treated),'control_cities':', '.join([x for x in qc.city.unique() if x not in treated]),'did_incremental_units_estimate':did,'interpretation':'Design demonstration only; no causal claim because treatment was not actually randomized'}])
did_out.to_csv(OUT/'incrementality_design.csv',index=False)

# 5. Activation uncertainty: bootstrap base profit ROI under three attribution cases.
ev['base_profit_after_spend'] = ev['contribution_profit_inr'] - ev['activation_spend_inr']
bootstrap = []
for case, factor in [('conservative',0.50),('base',1.00),('upside',1.35)]:
    roi_samples=[]
    for _ in range(2000):
        sample = ev.sample(len(ev),replace=True,random_state=int(rng.integers(1,100000)))
        attributed_profit = sample['contribution_profit_inr'].sum()*factor
        spend = sample['activation_spend_inr'].sum()
        roi_samples.append((attributed_profit-spend)/spend)
    bootstrap.append({'attribution_case':case,'mean_roi_pct':np.mean(roi_samples)*100,'p05_roi_pct':np.quantile(roi_samples,.05)*100,'p50_roi_pct':np.quantile(roi_samples,.50)*100,'p95_roi_pct':np.quantile(roi_samples,.95)*100,'positive_roi_probability':np.mean(np.array(roi_samples)>0),'n_bootstrap':2000})
pd.DataFrame(bootstrap).to_csv(OUT/'activation_bootstrap_roi.csv',index=False)

readme = '''# Advanced analytics outputs\n\nThese outputs are based on simulated portfolio data. Forecasts, clusters, predictive benchmarks, incrementality estimates, and activation bootstrap intervals are demonstrations of methodology and must not be presented as actual Red Bull results.\n'''
(OUT/'README.md').write_text(readme)
print('Advanced outputs written to', OUT)
print('Forecast metrics:\n', pd.DataFrame(metric_rows).to_string(index=False))
print('Predictive benchmark:\n', bench.to_string(index=False))
print('DiD design estimate:', did)
print('Activation bootstrap:\n', pd.DataFrame(bootstrap).to_string(index=False))
