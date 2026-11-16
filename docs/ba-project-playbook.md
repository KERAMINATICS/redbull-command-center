# BA Portfolio Playbook: Start With a Real Business Problem

## What the video recommends

The video argues for building from an organization’s *publicly described problem* rather than producing a generic clone. Its example is engineering-focused—Netflix’s Chaos Monkey—but the same method transfers cleanly to Business Analysis:

1. **Find a primary source (00:13–00:22).** The speaker starts with a company engineering blog. For a BA portfolio, use the organization’s annual report, investor/earnings materials, official newsroom, product or operations blog, public procurement brief, or a credible industry source that states the business context.
2. **Choose one narrow decision problem (00:23–00:34).** The video picks Chaos Monkey’s resilience problem. A BA version should name the decision owner, the decision to make, the outcome metric, the trade-off, and the decision date.
3. **Build a miniature solution (00:35–00:42).** The speaker builds a small version rather than reproducing a production system. A BA mini-solution can be a small dataset/model, decision dashboard, scenario simulator, prioritization rubric, or measurement plan.
4. **Credit and share the source (00:43–00:54).** Publish a clear README, cite the original source, distinguish public facts from assumptions, and send a short, respectful note to the author or relevant team member with the artifact link.
5. **Choose quality over volume (00:55–01:06).** The closing advice is “one company, one project, done well,” not a rush of shallow clones. Keep existing work, but make the portfolio’s focus obvious.

## The BA translation

Use this repeatable brief before building any new project:

> **Because [credible source] shows [specific business context], [decision owner] must choose [A/B] by [date]. The choice will be judged on [commercial KPI], subject to [cost/risk/operational constraint]. I built [small analytical artifact] using [public facts + clearly labeled assumptions] and would validate it with [real data/test].**

A portfolio project should answer four questions in its first screen or first page: **What is the real problem? What decision is being made? What did you build? What evidence would change the recommendation?** Charts and models are supporting evidence, not the project’s purpose.

## Applied to the IPL Sponsorship Commercial Value Engine

### 1. Public problem signal

JioStar’s official TATA IPL 2025 release reports large league-level audience and engagement figures. Those figures are useful context, but league-wide reach alone does not tell a sponsor what an individual rights asset caused in incremental contribution. Public sponsorship measurement guidance also distinguishes exposure/media-equivalent value from business outcomes.

### 2. Decision problem

A hypothetical sponsorship decision owner must decide whether to **renew, renegotiate, test, or stop scaling** individual assets. The project focuses on the gap between reported attention and incremental contribution after rights fees—not on making a bigger reach chart.

### 3. Miniature solution

The dashboard demonstrates an eight-asset inventory, a transparent quality score, direct/assisted/control-lift scenario views, a rights-fee simulator, an evidence-ingestion workflow, a difference-in-differences design, and a next-season measurement plan. The first-screen narrative now makes the sequence explicit: **public signal → evidence gap → prototype → decision**.

### 4. What the corrected decision model says

The key analytical repair was to stop adding media-equivalent exposure value to the commercial contribution used for ROI. In the current deterministic simulation, the control-lift contribution proxy totals **₹3.67m** against **₹71.7m** of modeled rights fees: **5.1% fee coverage** and **−94.9% modeled ROI**. Separately, the modeled media-equivalent value is **₹641.9m**; it is not cash contribution and is not allowed to rescue the renewal ROI. The high-quality signal candidate is **Jersey front**, but its simulated contribution proxy (₹0.89m) is far below its simulated fee (₹18.4m).

The useful BA recommendation is therefore **do not scale or approve a blanket renewal from these data**. Negotiate for outcome data and performance clauses, run a bounded treatment/control pilot, and decide from observed contribution and uncertainty. The data are synthetic, so this is a demonstration of decision discipline—not a finding about IPL, any sponsor, or rights holder. The perturbation range is also a modeled scenario range, not a real-world confidence interval.

## Portfolio sequence for this profile

The portfolio blueprint defines a coherent identity: a BA who frames ambiguous decisions, builds dependable analytical products, quantifies value and uncertainty, measures incrementality, and turns analysis into an operating plan. The repository already contains two distinct case-study workstreams; showcase them separately rather than implying that the sponsorship application is a Red Bull product:

| Portfolio card | What it demonstrates | Presentation rule |
|---|---|---|
| **Red Bull India Commercial Command Center** (Python analysis and synthetic datasets) | Channel economics, customer value, growth/profit trade-offs, forecasting, segmentation, activation measurement | State clearly that internal channel, consumer and event data are simulated; this is an independent portfolio case. |
| **IPL Sponsorship Commercial Value Engine** (this web application) | Sponsorship asset economics, attribution, scenario analysis, measurement design and stakeholder decision flow | Cite the public reach source; keep all sponsor-level inputs labeled synthetic; do not claim endorsement or actual sponsor results. |
| **Next build: EV charging network site-selection** | Geospatial prioritization, capital allocation, demand proxies, unit economics and downside scenarios | First choose one operator with a specific public expansion or utilization challenge. Cite that source before modeling; do not invent a company problem or use generic station data as evidence of private demand. |

The portfolio blueprint’s other project ideas (retention, promotions, airline recovery, fraud, sustainable packaging) remain a backlog—not eight simultaneous deliverables. Finish, explain, and publish one grounded project before starting the next.

## Interview-ready summary

> “I built an independent sponsorship decision prototype around a public reach report. The business question was whether reach justified renewal. I separated media-equivalent value from incremental contribution, labeled sponsor-level data as simulated, and found that the modeled contribution did not cover modeled rights fees. So my recommendation is not to claim a real ROI; it is to negotiate for measurement access, run a pre-registered holdout test, and scale only after observed incremental contribution clears an agreed hurdle.”

## Outreach note template

> Hi [Name] — I read your [report/post] about [specific public issue]. I built a small, independent BA prototype that turns the decision into [brief artifact]. I used public context plus clearly labeled assumptions, not internal company data. The most useful outcome was [decision/measurement insight], and I documented what evidence would validate or change it. Here is the project: [link]. Thanks for publishing the source.

## Final quality check before sharing

- Link the primary public source from the project page and README.
- Put the decision question, outcome metric and proposed next action above the detailed analysis.
- Keep public facts, synthetic inputs, estimates and recommendations visually distinct.
- Compare models with simple baselines; document uncertainty and failure modes.
- Do not call a proxy “causal,” a scenario “actual ROI,” or a quality band “statistical confidence.”
- Provide one concise README, one-page case study, reproducible run instructions and a 3–5 minute interview walkthrough.
