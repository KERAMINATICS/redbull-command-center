from pathlib import Path
import json
import pandas as pd
from openai import OpenAI

BASE = Path(__file__).resolve().parents[1] / 'data'
OUT = Path(__file__).resolve().parents[1] / 'advanced_outputs'
summary = pd.read_csv(BASE/'channel_summary.csv')
scenario = pd.read_csv(BASE/'investment_scenario.csv')
bench = pd.read_csv(OUT/'predictive_benchmark.csv')
activation = pd.read_csv(OUT/'activation_bootstrap_roi.csv')

context = {
    'disclosure': 'All values are simulated assumptions for an independent portfolio project; no private Red Bull data was used.',
    'channel_summary': summary.round(4).to_dict('records'),
    'investment_scenario': scenario.round(4).to_dict('records'),
    'predictive_benchmark': bench.round(4).to_dict('records'),
    'activation_bootstrap_roi': activation.round(4).to_dict('records')
}
client = OpenAI()
schema = {
    'type':'object', 'strict':True,
    'properties': {
        'executive_insight': {'type':'string'},
        'top_three_evidence_points': {'type':'array','items':{'type':'string'}},
        'recommended_action': {'type':'string'},
        'risks_and_caveats': {'type':'array','items':{'type':'string'}},
        'validation_plan': {'type':'array','items':{'type':'string'}}
    },
    'required':['executive_insight','top_three_evidence_points','recommended_action','risks_and_caveats','validation_plan'],
    'additionalProperties':False
}

def call(model, instruction):
    r = client.chat.completions.create(
        model=model,
        messages=[
            {'role':'system','content':'You are a senior commercial analytics reviewer. Use only the supplied computed values. Never invent facts about Red Bull or the market. Treat simulated data as simulated. Output valid JSON only.'},
            {'role':'user','content':instruction+'\n\nCOMPUTED CONTEXT:\n'+json.dumps(context)}
        ],
        response_format={'type':'json_schema','json_schema':{'name':'insight_pack','strict':True,'schema':schema}},
        max_completion_tokens=2500,
        extra_body={'reasoning':{'effort':'medium'}} if model in ['gpt-5-mini','gpt-5'] else {}
    )
    return json.loads(r.choices[0].message.content)

draft = call('gpt-5-mini', 'Draft an executive insight pack for a Power BI dashboard. Explain the quick-commerce recommendation, the role of convenience, the forecasting benchmark, and why activation ROI requires a broader measurement design.')
review = call('gpt-5', 'Review the draft implied by the computed context and produce a corrected executive insight pack. Be skeptical: distinguish descriptive association, scenario assumptions, and causal evidence. Recommend exactly what should be tested next.')
result = {'model_roles':{'draft':'gpt-5-mini','review':'gpt-5'},'draft':draft,'review':review,'grounding_note':'Both outputs were generated from computed project tables and must be human-reviewed before publication.'}
(OUT/'ai_insight_pack.json').write_text(json.dumps(result, indent=2))
print(json.dumps(result, indent=2))
