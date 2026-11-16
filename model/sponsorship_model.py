from pathlib import Path
import json
import numpy as np
import pandas as pd

OUT = Path('/home/ubuntu/redbull-command-center/client/src/data')
OUT.mkdir(parents=True, exist_ok=True)

assets = pd.DataFrame([
    ['Jersey front', 'Broadcast', 18.4, 720, 0.78, 0.86, 0.74, 0.38, 4200, 1250, 610, 3.2, 86],
    ['Boundary LED', 'Broadcast', 14.8, 540, 0.69, 0.64, 0.63, 0.29, 3100, 930, 390, 2.3, 54],
    ['Strategic timeout', 'Broadcast', 9.6, 180, 0.84, 0.77, 0.81, 0.46, 1980, 710, 335, 1.7, 42],
    ['Digital match hub', 'Digital', 8.3, 290, 0.62, 0.71, 0.72, 0.58, 3640, 1510, 520, 1.25, 31],
    ['Fan park', 'Experiential', 6.9, 95, 0.88, 0.91, 0.86, 0.64, 2870, 980, 470, 1.9, 22],
    ['Creator matchday', 'Social', 5.7, 210, 0.55, 0.68, 0.60, 0.51, 4120, 1730, 460, 1.1, 19],
    ['Retail take-over', 'Retail', 4.4, 64, 0.72, 0.74, 0.70, 0.79, 1540, 630, 290, 0.95, 15],
    ['Training ground', 'Content', 3.6, 38, 0.64, 0.69, 0.66, 0.31, 820, 260, 95, 0.7, 11],
], columns=['asset','type','rights_fee_m','visibility_sec','placement_q','audience_q','engagement_q','conversion_rate','reach_m','qr_scans','conversions','retail_lift_m','cpm_inr'])

assets['quality_score'] = (0.26 * np.minimum(assets.visibility_sec / 600, 1) + 0.24 * assets.placement_q + 0.24 * assets.audience_q + 0.16 * assets.engagement_q + 0.10 * (assets.conversion_rate / assets.conversion_rate.max()))
assets['quality_contacts_m'] = assets.reach_m * assets.quality_score
assets['media_value_m'] = assets.quality_contacts_m * assets.cpm_inr / 1000
assets['direct_value_m'] = assets.conversions * 1000 * 0.082 / 1_000_000
assets['assisted_value_m'] = assets.direct_value_m * 1.42 + assets.retail_lift_m * 0.31
assets['control_lift_m'] = (assets.direct_value_m * 1.18 + assets.retail_lift_m * 0.46) * 0.58
# Keep media-equivalent exposure value separate from commercial contribution.
# The primary decision case uses the modeled control-lift contribution proxy only.
assets['commercial_value_m'] = assets.control_lift_m
assets['roi_pct'] = (assets.commercial_value_m - assets.rights_fee_m) / assets.rights_fee_m * 100
assets['cpqc_inr'] = assets.rights_fee_m * 1_000_000 / (assets.quality_contacts_m * 1_000_000)
assets['quality_band'] = np.select([assets.quality_score >= .72, assets.quality_score >= .62], ['High quality','Medium quality'], default='Low quality')
# Synthetic scores can prioritize measurement, but cannot authorize renewal or exit.
assets['recommendation'] = np.where(assets.quality_score >= .62, 'TEST / MEASURE', 'RENEGOTIATE / HOLD')
assets['measurement_gap'] = np.select([
    assets.asset.isin(['Retail take-over','Digital match hub']),
    assets.asset.isin(['Jersey front','Boundary LED','Strategic timeout']),
], ['Need geo-level sell-out and consented redemption link','Need placement log, unique reach, and matched control'], default='Need clean-room match and holdout design')

# Deterministic scenario bands are decision ranges, not population confidence intervals.
scenarios = []
for _, row in assets.iterrows():
    for case, value in [('Direct', row.direct_value_m), ('Assisted + retail', row.assisted_value_m), ('Control-market lift', row.control_lift_m)]:
        scenarios.append({'asset':row.asset, 'case':case, 'value_m':round(float(value),2), 'roi_pct':round(float((value-row.rights_fee_m)/row.rights_fee_m*100),1)})

months = ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
season = []
for i, m in enumerate(months):
    season.append({'month':m, 'quality_contacts_m':round(3.9 + i*0.23 + (0.18 if i in [1,4,7] else 0),2), 'direct_value_m':round(0.72 + i*0.07,2), 'retail_lift_m':round(0.38 + i*0.035,2)})

# Bootstrap-style uncertainty around portfolio ROI using deterministic perturbation of modeled lift.
rng = np.random.default_rng(20260903)
portfolio_fee = assets.rights_fee_m.sum()
base = assets.commercial_value_m.sum()
samples = []
for _ in range(4000):
    lift = rng.normal(1.0, 0.16, len(assets)).clip(0.55, 1.55)
    samples.append(((assets.commercial_value_m.to_numpy() * lift).sum() - portfolio_fee) / portfolio_fee * 100)
samples = np.array(samples)
uncertainty = {'p10':round(float(np.percentile(samples,10)),1),'p50':round(float(np.percentile(samples,50)),1),'p90':round(float(np.percentile(samples,90)),1),'min':round(float(samples.min()),1),'max':round(float(samples.max()),1)}

payload = {
    'meta': {'title':'IPL Sponsorship Commercial Value Engine','as_of':'2026-09-03','status':'SIMULATED MODEL','currency':'INR millions'},
    'public_context': {'reach_m':19000,'tv_reach_m':537,'digital_reach_m':652,'social_interactions_b':83,'source':'JioStar TATA IPL 2025 public release'},
    'assets': [{k:(round(float(v),2) if isinstance(v,(np.floating,float)) else int(v) if isinstance(v,(np.integer,)) else v) for k,v in r.items()} for r in assets.to_dict(orient='records')],
    'scenarios': scenarios,
    'season': season,
    'uncertainty': uncertainty,
    'portfolio': {'rights_fee_m':round(float(portfolio_fee),1),'media_value_m':round(float(assets.media_value_m.sum()),1),'commercial_value_m':round(float(base),2),'commercial_roi_pct':round(float((base-portfolio_fee)/portfolio_fee*100),1),'fee_coverage_pct':round(float(base/portfolio_fee*100),1),'quality_contacts_m':round(float(assets.quality_contacts_m.sum()),2),'test_priority_value_m':round(float(assets.loc[assets.recommendation.eq('TEST / MEASURE'),'commercial_value_m'].sum()),2)},
    'method': {'quality_formula':'26% visibility + 24% placement + 24% audience + 16% engagement + 10% conversion quality','cases':['Direct','Assisted + retail','Control-market lift'],'uncertainty':'4,000 deterministic-seed perturbation draws around simulated control-lift contribution; not a real-world confidence interval'}
}

(OUT / 'sponsorshipData.ts').write_text('export const sponsorshipData = ' + json.dumps(payload, indent=2) + ' as const;\n', encoding='utf-8')
print(json.dumps({'assets':len(assets),'portfolio':payload['portfolio'],'uncertainty':uncertainty}, indent=2))
