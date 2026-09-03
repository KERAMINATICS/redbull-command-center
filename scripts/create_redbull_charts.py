from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

BASE = Path(__file__).resolve().parents[1] / 'data'
FIG = Path(__file__).resolve().parents[1] / 'figures'
FIG.mkdir(exist_ok=True)
sns.set_theme(style='whitegrid', font_scale=1.0)
blue = '#0b3d91'; red = '#d71920'; gray = '#4b5563'

summary = pd.read_csv(BASE/'channel_summary.csv')
scenario = pd.read_csv(BASE/'investment_scenario.csv')
act = pd.read_csv(BASE/'activation_summary.csv')

plt.figure(figsize=(10,6))
s = summary.sort_values('contribution_profit_inr')
plt.barh(s['channel'], s['contribution_profit_inr']/1e6, color=blue)
plt.xlabel('Modeled contribution profit (₹ million)')
plt.ylabel('Channel')
plt.title('Modeled channel contribution profit\nSimulated portfolio dataset — not actual Red Bull performance', loc='left', weight='bold')
plt.tight_layout(); plt.savefig(FIG/'channel_profit.png', dpi=180); plt.close()

plt.figure(figsize=(10,6))
s = scenario.sort_values('profit_roi_pct')
colors = [red if x == scenario.iloc[0]['channel'] else blue for x in s['channel']]
plt.barh(s['channel'], s['profit_roi_pct'], color=colors)
plt.xlabel('Modeled incremental profit ROI (%)')
plt.ylabel('Channel')
plt.title('₹1 million incremental investment test\nSimulated response assumptions', loc='left', weight='bold')
plt.tight_layout(); plt.savefig(FIG/'investment_roi.png', dpi=180); plt.close()

plt.figure(figsize=(10,6))
sc = scenario.sort_values('estimated_12m_retained_consumers')
plt.scatter(sc['incremental_new_consumers'], sc['incremental_profit_inr']/1e3, s=120, color=blue)
for _, r in sc.iterrows():
    plt.annotate(r['channel'], (r['incremental_new_consumers'], r['incremental_profit_inr']/1e3), xytext=(5,5), textcoords='offset points', fontsize=9)
plt.xlabel('Modeled incremental new consumers')
plt.ylabel('Modeled incremental profit (₹ thousand)')
plt.title('Growth versus profit trade-off\nSimulated ₹1 million investment scenario', loc='left', weight='bold')
plt.tight_layout(); plt.savefig(FIG/'growth_profit_tradeoff.png', dpi=180); plt.close()

plt.figure(figsize=(10,6))
a = act.sort_values('base_profit_roi_pct')
plt.barh(a['activation_name'], a['base_profit_roi_pct'], color=red)
plt.xlabel('Base-case profit ROI (%)')
plt.ylabel('Activation')
plt.title('Sports activation performance model\nBase attribution case; simulated data', loc='left', weight='bold')
plt.tight_layout(); plt.savefig(FIG/'activation_roi.png', dpi=180); plt.close()
print('Charts created in', FIG)
