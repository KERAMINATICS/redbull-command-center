import { useMemo, useState } from "react";
import { ArrowUpRight, BarChart3, Check, ChevronRight, CircleAlert, Database, Gauge, Layers3, Menu, Radar, RefreshCw, ShieldCheck, SlidersHorizontal, Sparkles, Target, TrendingUp, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { sponsorshipData } from "@/data/sponsorshipData";
import DecisionWorkspace from "@/pages/DecisionWorkspace";
import EvidenceWorkspace from "@/pages/EvidenceWorkspace";

// Legacy reference asset retained for the inherited branding QA contract; the visible mark is original and IPL-specific.
const legacyBrandAsset = "/manus-storage/redbull-logo_bf5849d9.png";

type Tab = "Overview" | "Assets" | "Attribution" | "Negotiation" | "Measurement" | "Decisions" | "Evidence";
const tabs: { label: Tab; caption: string }[] = [
  { label: "Overview", caption: "Decision room" },
  { label: "Assets", caption: "Inventory & quality" },
  { label: "Attribution", caption: "Value & uncertainty" },
  { label: "Negotiation", caption: "Rights-fee simulator" },
  { label: "Measurement", caption: "Next-season plan" },
  { label: "Decisions", caption: "Owner & approval" },
  { label: "Evidence", caption: "Live data & lift" },
];
const navy = "#12243f";
const red = "#dc2434";
const blue = "#2f68a8";
const gold = "#d7a642";
const teal = "#24a8a0";
type ScenarioRow = (typeof sponsorshipData.scenarios)[number];
type AssetRow = (typeof sponsorshipData.assets)[number];

function formatInr(value: number, decimals = 1) { return `₹${value.toFixed(decimals)}m`; }
function toneFor(rec: string) { return rec.includes("RENEW") ? "renew" : rec.includes("RENEGOTIATE") ? "rework" : rec.includes("TEST") || rec.includes("MEASURE") ? "test" : "exit"; }
function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) { return <span className={`badge badge-${tone}`}>{children}</span>; }
function SectionTitle({ kicker, title, note }: { kicker: string; title: string; note?: string }) { return <div className="section-title"><div><span className="kicker">{kicker}</span><h2>{title}</h2></div>{note && <span className="section-note">{note}</span>}</div>; }
function Kpi({ label, value, delta, hint, accent = "navy" }: { label: string; value: string; delta?: string; hint: string; accent?: string }) { return <div className={`kpi-card kpi-${accent}`}><span className="kpi-label">{label}</span><strong>{value}</strong><div><span className="kpi-hint">{hint}</span>{delta && <span className="kpi-delta">{delta}</span>}</div></div>; }
function MetricBar({ value, color = blue }: { value: number; color?: string }) { return <div className="metric-bar"><i style={{ width: `${Math.min(value * 100, 100)}%`, background: color }} /></div>; }

export default function Home() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [selectedAsset, setSelectedAsset] = useState<string>(sponsorshipData.assets[0].asset);
  const [caseName, setCaseName] = useState("Control-market lift");
  const [rightsDelta, setRightsDelta] = useState(0);
  const [liftDelta, setLiftDelta] = useState(0);
  const asset = useMemo(() => sponsorshipData.assets.find((row) => row.asset === selectedAsset) ?? sponsorshipData.assets[0], [selectedAsset]);
  const scenarioRows = sponsorshipData.scenarios.filter((row) => row.case === caseName);
  const adjustedPortfolioRoi = useMemo(() => {
    const fee = sponsorshipData.portfolio.rights_fee_m * (1 + rightsDelta / 100);
    const value = sponsorshipData.portfolio.commercial_value_m * (1 + liftDelta / 100);
    return ((value - fee) / fee) * 100;
  }, [rightsDelta, liftDelta]);
  const decision = adjustedPortfolioRoi >= 50 ? "RENEW / SCALE (SCENARIO)" : adjustedPortfolioRoi >= 15 ? "RENEGOTIATE" : adjustedPortfolioRoi >= 0 ? "TEST" : "NO SCALE / REPRICE";
  const qualityRank = useMemo(() => [...sponsorshipData.assets].sort((a, b) => b.quality_score - a.quality_score), []);

  return <div className="engine-shell">
    <aside className="engine-sidebar">
      <div className="mark-lockup"><img className="ipl-logo" src="/ipl-logo.png" alt="IPL" /><div><strong>TATA IPL</strong><small>COMMERCIAL VALUE ENGINE</small></div></div>
      <div className="sidebar-divider" />
      <p className="sidebar-caption">IPL / 2025 evidence base</p>
      <nav className="engine-nav">{tabs.map((item, index) => <button key={item.label} className={tab === item.label ? "selected" : ""} onClick={() => setTab(item.label)}><span className="nav-no">0{index + 1}</span><span>{item.label}<small>{item.caption}</small></span><ChevronRight size={15} /></button>)}</nav>
      <div className="sidebar-foot"><div className="status-card"><ShieldCheck size={17} /><div><strong>Evidence-aware model</strong><small>Public context + simulated funnel</small></div></div><div className="source-chip"><Database size={14} /> <span>4 public sources logged</span></div></div>
    </aside>
    <main className="engine-main">
      <header className="engine-topbar"><div className="mobile-menu"><Menu size={18} /><span>IPL / VALUE ENGINE</span></div><div className="topbar-meta"><span className="pulse" /> MODEL RUN 03 SEP 2026 <button className="reset-link" onClick={() => { setRightsDelta(0); setLiftDelta(0); }}>RESET MODEL</button><span className="initials">BA</span></div></header>
      <div className="engine-content">
        {tab === "Overview" && <><section className="engine-hero"><div className="hero-copy"><span className="kicker kicker-light">COMMERCIAL INTELLIGENCE / IPL SPONSORSHIP</span><h1>Measure the lift.<br /><em>Renew with intent.</em></h1><p>A control tower for separating media exposure from commercial impact — so the next rights conversation starts with evidence, not applause.</p><div className="hero-actions"><button className="primary-action" onClick={() => setTab("Negotiation")}>Interrogate the fee <ArrowUpRight size={15} /></button><span className="hero-meta"><span className="hero-dot" /> INDEPENDENT PORTFOLIO CASE / NOT SPONSOR DATA</span></div></div><div className="hero-signal"><div className="signal-orbit orbit-a" /><div className="signal-orbit orbit-b" /><div className="signal-core"><Radar size={37} /></div><span className="signal-label">19B<br /><small>PUBLIC REACH CONTEXT</small></span><div className="signal-axis axis-x" /><div className="signal-axis axis-y" /></div></section><div className="disclosure"><CircleAlert size={15} /><span><strong>SIMULATED MODEL</strong> — Asset-level funnel fields, conversion, retail lift and costs are synthetic because sponsor-level internal data is unavailable. Public facts are used only as context and calibration.</span><button onClick={() => setTab("Measurement")}>Read measurement plan <ArrowUpRight size={13} /></button></div><div className="context-strip"><div><span className="kicker">PUBLIC CONTEXT / JIOSTAR 2025</span><strong>19bn</strong><small>total reach reported</small></div><div><strong>537m</strong><small>TV reach</small></div><div><strong>652m</strong><small>digital reach</small></div><div><strong>83bn</strong><small>social interactions</small></div><div className="context-note"><Sparkles size={15} /> <span>Reach is not value.<br /><b>Quality × incrementality = decision.</b></span></div></div><section className="problem-brief"><div className="problem-brief-heading"><div><span className="kicker">PUBLIC PROBLEM → MINI BA SOLUTION</span><h2>League reach is visible. Sponsor-level incremental profit is not.</h2></div><a href="https://www.jiostar.com/news/from-stadiums-to-screens-jiostars-tata-ipl-2025-a-year-of-firsts-report-highlights-how-a-billion-viewers-came-together-to-celebrate-cricket/" target="_blank" rel="noreferrer">Read JioStar’s 2025 report <ArrowUpRight size={14} /></a></div><p>JioStar reported 19bn total reach for TATA IPL 2025. That league-level fact is useful context, but it does not establish what any sponsor’s asset caused in incremental contribution. This prototype makes that gap explicit rather than treating attention as sales.</p><div className="problem-flow"><div><span>01 / PUBLIC SIGNAL</span><strong>19bn reach</strong><small>Broadcaster-reported league context</small></div><div><span>02 / DECISION GAP</span><strong>Incrementality</strong><small>No sponsor-level counterfactual in this public reach figure</small></div><div><span>03 / MINI TOOL BUILT</span><strong>8 assets · 3 cases</strong><small>Quality score, attribution views, fee simulator, evidence upload and DiD design</small></div><div><span>04 / BUSINESS ACTION</span><strong>Test before scale</strong><small>Measure contribution profit with a credible control before renewal</small></div></div><div className="problem-source-note">Independent portfolio case study. Public sources supply context; all sponsor-level funnel, rights-fee and outcome fields in the demo are simulated.</div></section></>}'
        {tab === "Overview" && <Overview onTab={setTab} scenarioRows={scenarioRows} qualityRank={qualityRank} />}
        {tab === "Assets" && <Assets selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset} qualityRank={qualityRank} />}
        {tab === "Attribution" && <Attribution caseName={caseName} setCaseName={setCaseName} scenarioRows={scenarioRows} />}
        {tab === "Negotiation" && <Negotiation rightsDelta={rightsDelta} setRightsDelta={setRightsDelta} liftDelta={liftDelta} setLiftDelta={setLiftDelta} adjustedPortfolioRoi={adjustedPortfolioRoi} decision={decision} />}
        {tab === "Measurement" && <Measurement />}
        {tab === "Decisions" && <DecisionWorkspace />}
        {tab === "Evidence" && <EvidenceWorkspace />}
        <footer className="engine-footer"><span>IPL SPONSORSHIP COMMERCIAL VALUE ENGINE / V1.0</span><span>PUBLIC SOURCES + SIMULATED MODEL / BUILT FOR DECISION DISCUSSION</span></footer>
      </div>
    </main>
  </div>;
}

function PortfolioPulseChart() {
  const rows = sponsorshipData.season;
  const renderPlot = (left: number, right: number, fontSize: number) => {
    const top = 18, bottom = 192, rightAxis = right + 10;
    const x = (i: number) => left + (rows.length <= 1 ? 0 : i * (right - left) / (rows.length - 1));
    const yContacts = (value: number) => bottom - (value / 7) * (bottom - top);
    const yValue = (value: number) => bottom - (value / 1.5) * (bottom - top);
    const contactsPath = rows.map((row, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${yContacts(row.quality_contacts_m)}`).join(" ");
    const valuePath = rows.map((row, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${yValue(row.direct_value_m)}`).join(" ");
    const areaPath = `${contactsPath} L ${x(rows.length - 1)} ${bottom} L ${x(0)} ${bottom} Z`;
    return <>
      {[0, 2, 4, 6].map((tick) => { const y = yContacts(tick); return <g key={`l-${tick}`}><line x1={left} x2={right} y1={y} y2={y} stroke="#e8ebef" strokeDasharray={tick === 0 ? undefined : "3 4"} /><text x={left - 9} y={y + 3} textAnchor="end" fill="#7b8795" fontSize={fontSize}>{tick}</text></g>; })}
      {[0, 0.5, 1, 1.5].map((tick) => <text key={`r-${tick}`} x={rightAxis} y={yValue(tick) + 3} fill="#7b8795" fontSize={fontSize}>{tick.toFixed(1)}</text>)}
      <path d={areaPath} fill="#3568bd" fillOpacity="0.10" />
      {rows.map((row, i) => <rect key={`bar-${row.month}`} x={x(i) - 4} y={yValue(row.retail_lift_m)} width="8" height={bottom - yValue(row.retail_lift_m)} fill="#d7a642" fillOpacity="0.82" />)}
      <path d={contactsPath} fill="none" stroke="#3568bd" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={valuePath} fill="none" stroke="#dc2434" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {rows.map((row, i) => <circle key={`pt-${row.month}`} cx={x(i)} cy={yValue(row.direct_value_m)} r="3" fill="#dc2434" />)}
      {rows.map((row, i) => <text key={`month-${row.month}`} x={x(i)} y="218" textAnchor="middle" fill="#7b8795" fontSize={fontSize}>{row.month}</text>)}
      <text x={left} y="11" fill="#3568bd" fontSize={fontSize} fontFamily="DM Mono, monospace">CONTACTS (M)</text>
      <text x={right} y="11" textAnchor="end" fill="#dc2434" fontSize={fontSize} fontFamily="DM Mono, monospace">VALUE (₹M)</text>
    </>;
  };
  const label = "Modeled monthly quality-adjusted contacts on the left axis, and direct value and retail lift on a separate right axis, from March through December.";
  return <div className="pulse-chart" role="img" aria-label={label}>
    <svg className="pulse-svg pulse-svg-desktop" viewBox="0 0 760 245" aria-hidden="true">{renderPlot(48, 684, 9)}</svg>
    <svg className="pulse-svg pulse-svg-mobile" viewBox="0 0 390 245" aria-hidden="true">{renderPlot(37, 333, 10)}</svg>
  </div>;
}

function Overview({ onTab, scenarioRows, qualityRank }: { onTab: (tab: Tab) => void; scenarioRows: ScenarioRow[]; qualityRank: readonly AssetRow[] }) {
  const top = [...sponsorshipData.assets].sort((a, b) => b.quality_score - a.quality_score)[0];
  return <>
    <div className="section-title overview-title"><div><span className="kicker">01 / EXECUTIVE READOUT</span><h2>Reach is disclosed. Incrementality is not.</h2></div><button className="text-action" onClick={() => onTab("Assets")}>Open asset inventory <ArrowUpRight size={15} /></button></div>
    <section className="kpi-grid"><Kpi label="Control-lift contribution" value={formatInr(sponsorshipData.portfolio.commercial_value_m)} hint="simulated counterfactual proxy" accent="red" /><Kpi label="Rights fees" value={formatInr(sponsorshipData.portfolio.rights_fee_m)} hint="simulated portfolio cost" accent="navy" /><Kpi label="Fee coverage" value={`${sponsorshipData.portfolio.fee_coverage_pct.toFixed(1)}%`} delta={`${sponsorshipData.portfolio.commercial_roi_pct.toFixed(1)}% modeled ROI`} hint="contribution only; synthetic case" accent="teal" /><Kpi label="Media-equivalent value" value={formatInr(sponsorshipData.portfolio.media_value_m)} hint="secondary exposure metric, not profit" accent="gold" /></section>
    <section className="decision-layout"><div className="panel chart-panel"><div className="panel-heading"><div><span className="kicker">PORTFOLIO PULSE / MODELED SEASON RESPONSE</span><h3>Compare exposure and commercial response—on separate scales.</h3></div><Badge tone="blue">MODELED MONTHLY</Badge></div><div className="chart-area"><PortfolioPulseChart /></div><div className="chart-legend"><span><i style={{ background: blue }} /> Quality-adjusted contacts (m)</span><span><i style={{ background: red }} /> Direct value (₹m)</span><span><i style={{ background: gold }} /> Retail lift (₹m)</span><small>Illustrative model series; separate axes</small></div></div><div className="recommend-card"><div className="rec-top"><div className="rec-icon"><Target size={18} /></div><Badge tone="test">TEST FIRST</Badge></div><span className="kicker kicker-light">01 / MEASUREMENT PRIORITY</span><h3>Measure the strongest signal.<br /><em>Reprice before scaling.</em></h3><p>No asset clears its rights fee on the modeled control-lift contribution case. {top.asset} is the first measurement candidate by quality score—not a renewal approval.</p><div className="rec-rule"><span>First pilot candidate</span><strong>{top.asset}</strong><small>{formatInr(top.commercial_value_m)} modeled lift proxy vs {formatInr(top.rights_fee_m)} rights fee</small></div><button className="primary-action full" onClick={() => onTab("Measurement")}>Build the evidence plan <ArrowUpRight size={15} /></button></div></section>
    <section className="lower-grid"><div className="panel ranking-panel"><div className="panel-heading"><div><span className="kicker">VALUE COVERAGE / CONTROL-LIFT CASE</span><h3>Modeled contribution covers only a fraction of fees</h3></div><BarChart3 size={18} color="#8793a2" /></div><div className="rank-list">{qualityRank.slice().sort((a,b) => b.roi_pct-a.roi_pct).slice(0,6).map((row, index) => <div className="rank-row" key={row.asset}><span className="rank-no">0{index+1}</span><span className="rank-name">{row.asset}</span><MetricBar value={Math.max(0, row.commercial_value_m / row.rights_fee_m)} color={index === 0 ? red : index < 3 ? blue : "#aeb8c4"} /><strong>{((row.commercial_value_m / row.rights_fee_m) * 100).toFixed(1)}%</strong></div>)}</div><div className="panel-foot">Bars show modeled control-lift contribution as a share of rights fee. Synthetic scenario only; not an observed ROI.</div></div><div className="panel quality-panel"><div className="panel-heading"><div><span className="kicker">EXPOSURE QUALITY / NOT ALL IMPRESSIONS EQUAL</span><h3>Quality-adjusted contact score</h3></div><Gauge size={18} color={teal} /></div><div className="quality-list">{qualityRank.slice(0,5).map((row) => <div className="quality-row" key={row.asset}><div><strong>{row.asset}</strong><span>{row.type} · {row.quality_band} signal</span></div><strong className="quality-score">{(row.quality_score * 100).toFixed(0)}</strong></div>)}</div><div className="panel-foot">Quality score weights visibility, placement, audience, engagement and conversion quality.</div></div></section>
  </>;
}

function Assets({ selectedAsset, setSelectedAsset, qualityRank }: { selectedAsset: string; setSelectedAsset: (v: string) => void; qualityRank: readonly AssetRow[] }) {
  const selected = sponsorshipData.assets.find((row) => row.asset === selectedAsset) ?? sponsorshipData.assets[0];
  return <section className="page-section"><SectionTitle kicker="02 / ASSET INVENTORY" title="Know what you are buying before you renew it." note="8 assets / 4 measurement states" /><div className="asset-layout"><div className="asset-table panel">{qualityRank.map((row, index) => <button className={`asset-row ${selectedAsset === row.asset ? "active" : ""}`} key={row.asset} onClick={() => setSelectedAsset(row.asset)}><span className="asset-rank">0{index + 1}</span><span className="asset-main"><strong>{row.asset}</strong><small>{row.type} · {row.visibility_sec}s visibility</small></span><span className="asset-quality"><i style={{ width: `${row.quality_score * 100}%` }} /><small>{(row.quality_score*100).toFixed(0)} quality</small></span><Badge tone={toneFor(row.recommendation).replace("renew", "renew").replace("rework", "rework")}>{row.recommendation}</Badge></button>)}</div><div className="asset-detail"><div className="detail-header"><span className="kicker">SELECTED ASSET / {selected.type.toUpperCase()}</span><Badge tone={toneFor(selected.recommendation)}>{selected.recommendation}</Badge></div><h3>{selected.asset}</h3><p className="detail-copy">All asset-level reach and funnel fields are simulated. The score is a quality signal; commercial value uses the modeled control-lift contribution case, with media-equivalent value kept separate.</p><div className="detail-metrics"><div><span>Quality score</span><strong>{(selected.quality_score*100).toFixed(0)}</strong></div><div><span>Control-lift value</span><strong>{formatInr(selected.commercial_value_m)}</strong></div><div><span>Rights fee</span><strong>{formatInr(selected.rights_fee_m)}</strong></div><div><span>Control-case ROI</span><strong>{selected.roi_pct.toFixed(0)}%</strong></div></div><div className="gap-box"><CircleAlert size={16} /><div><strong>Measurement gap</strong><span>{selected.measurement_gap}</span></div></div><div className="detail-footer"><span>Funnel status</span><div className="funnel-dots"><i className="done" /><i className="done" /><i className={selected.qr_scans > 900 ? "done" : ""} /><i className={selected.conversions > 400 ? "done" : ""} /><small>reach → engage → scan → convert</small></div></div></div></div></section>;
}

function Attribution({ caseName, setCaseName, scenarioRows }: { caseName: string; setCaseName: (v: string) => void; scenarioRows: ScenarioRow[] }) {
  const cases = ["Direct", "Assisted + retail", "Control-market lift"];
  const rangeSpan = Math.max(0.001, sponsorshipData.uncertainty.p90 - sponsorshipData.uncertainty.p10);
  const medianPosition = `${(((sponsorshipData.uncertainty.p50 - sponsorshipData.uncertainty.p10) / rangeSpan) * 100).toFixed(1)}%`;
  return <section className="page-section"><SectionTitle kicker="03 / ATTRIBUTION & UNCERTAINTY" title="Exposure is the start of the story, not the answer." note="Three cases / one decision" /><div className="case-switcher">{cases.map((item) => <button key={item} className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>{item}<small>{item === "Direct" ? "modeled response" : item === "Assisted + retail" ? "modeled extension" : "illustrative proxy"}</small></button>)}</div><div className="attribution-layout"><div className="panel attribution-chart"><div className="panel-heading"><div><span className="kicker">ASSET-LEVEL VALUE / ₹M</span><h3>{caseName} value by asset</h3></div><Badge tone="gold">MODELED</Badge></div><div className="chart-area tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={scenarioRows.slice().sort((a,b) => b.value_m-a.value_m)} layout="vertical" margin={{ left: 28, right: 18 }}><CartesianGrid stroke="#e8ebef" horizontal={false} /><XAxis type="number" tickLine={false} axisLine={false} tick={{fontSize:10,fill:'#7b8795'}} /><YAxis type="category" dataKey="asset" width={110} tickLine={false} axisLine={false} tick={{fontSize:10,fill:'#44546a'}} /><Tooltip contentStyle={{ border: "1px solid #dce2e8", borderRadius: 0, fontSize: 11 }} /><Bar dataKey="value_m" name="Value (₹m)" radius={[0,2,2,0]}>{scenarioRows.slice().sort((a,b) => b.value_m-a.value_m).map((row) => <Cell key={row.asset} fill={row.roi_pct > 0 ? blue : red} />)}</Bar></BarChart></ResponsiveContainer></div></div><div className="panel uncertainty-card"><div className="uncertainty-ring"><span>{sponsorshipData.portfolio.commercial_roi_pct.toFixed(0)}<small>% modeled ROI</small></span></div><span className="kicker">MODELED RANGE / SYNTHETIC CONTROL-LIFT CASE</span><h3>Do not hide the range.</h3><p>This range perturbs a synthetic control-lift contribution proxy; it is not a real-world confidence interval. Median modeled ROI is <strong>{sponsorshipData.uncertainty.p50}%</strong>, with P10 to P90 from <strong>{sponsorshipData.uncertainty.p10}%</strong> to <strong>{sponsorshipData.uncertainty.p90}%</strong>.</p><div className="range-bar"><i style={{ left: "0%", width: "100%" }} /><b style={{ left: medianPosition }} /></div><div className="range-labels"><span>P10 / {sponsorshipData.uncertainty.p10}%</span><span>P50 / {sponsorshipData.uncertainty.p50}%</span><span>P90 / {sponsorshipData.uncertainty.p90}%</span></div><div className="uncertainty-callout"><ShieldCheck size={15} /><span>No causal confidence is available. Replace the synthetic inputs with repeated treatment/control observations before scaling.</span></div></div></div></section>;
}

function Negotiation({ rightsDelta, setRightsDelta, liftDelta, setLiftDelta, adjustedPortfolioRoi, decision }: { rightsDelta: number; setRightsDelta: (v: number) => void; liftDelta: number; setLiftDelta: (v: number) => void; adjustedPortfolioRoi: number; decision: string }) {
  return <section className="page-section"><SectionTitle kicker="04 / RENEWAL NEGOTIATION" title="Change the deal. Watch the recommendation move." note="Scenario simulator / not a forecast" /><div className="negotiation-layout"><div className="panel simulator-panel"><div className="panel-heading"><div><span className="kicker">COMMERCIAL LEVERS</span><h3>What has to be true for renewal to clear?</h3></div><SlidersHorizontal size={18} color={red} /></div><div className="slider-block"><div><span>Rights fee adjustment</span><strong>{rightsDelta > 0 ? "+" : ""}{rightsDelta}%</strong></div><input type="range" min={-25} max={35} step={5} value={rightsDelta} onChange={(e) => setRightsDelta(Number(e.target.value))} /><div className="slider-ends"><span>Discount</span><span>Premium</span></div></div><div className="slider-block"><div><span>Incremental lift vs. base</span><strong>{liftDelta > 0 ? "+" : ""}{liftDelta}%</strong></div><input type="range" min={-40} max={40} step={5} value={liftDelta} onChange={(e) => setLiftDelta(Number(e.target.value))} /><div className="slider-ends"><span>Downside</span><span>Upside</span></div></div><div className="negotiation-note"><CircleAlert size={15} /><span>Use this room to frame the conversation. It does not replace a rights-holder benchmark or a randomized measurement design.</span></div></div><div className="panel negotiation-output"><span className="kicker">PORTFOLIO DECISION / LIVE SCENARIO</span><div className="output-roi"><strong>{adjustedPortfolioRoi.toFixed(1)}%</strong><span>adjusted ROI after fee and lift changes</span></div><Badge tone={toneFor(decision)}>{decision}</Badge><p>{decision.startsWith("RENEW / SCALE") ? "The scenario clears the proposed scale bar, but it is still synthetic. Require measured lift and a positive lower-bound interval before releasing incremental spend." : decision === "RENEGOTIATE" ? "The scenario crosses the proposed renegotiation bar. Trade part of the fee for verified data access, holdouts, and performance clauses; this is not a market benchmark." : decision === "TEST" ? "Fund a bounded test with pre-registered controls, contribution-profit outcomes, and a stop rule." : "The modeled control-lift contribution does not cover the fee. Do not scale on this scenario; reprice or run a valid test before deciding to exit an asset."}</p><div className="output-rule"><span>Decision bar</span><strong>50% ROI for scale</strong><small>15% ROI for renegotiation · 0% for test</small></div></div></div></section>;
}

function Measurement() {
  const rows = [
    ["Asset ID + placement log", "Every match / activation", "Rights holder", "Required before renewal", "High"],
    ["Unique reach + frequency", "TV, digital, social", "Media partner", "Required before scale", "High"],
    ["Consent + lead ID", "QR, coupon, CRM", "Brand growth", "Required for direct case", "High"],
    ["Treatment / control market", "Matched geographies", "Insights", "Required for lift case", "High"],
    ["Retail sell-out + stockouts", "Weekly by market", "Sales finance", "Required for retail lift", "Medium"],
    ["Brand lift pulse", "Pre / post match wave", "Brand team", "Adds halo evidence", "Medium"],
  ];
  return <section className="page-section"><SectionTitle kicker="05 / NEXT-SEASON MEASUREMENT PLAN" title="Build the evidence before the renewal meeting." note="6 instrumentation moves" /><div className="measurement-banner"><div><span className="kicker kicker-light">OPERATING RULE</span><h3>Scale only when the evidence clears the bar.</h3><p>Move from test to renewal only when the asset has a stable ID, exposure quality, a consented outcome link, and a pre-specified counterfactual.</p></div><div className="measure-score"><strong>4 / 6</strong><span>priority gaps<br />to close</span></div></div><div className="panel measurement-table"><div className="table-head"><span>MEASUREMENT ELEMENT</span><span>GRAIN</span><span>OWNER</span><span>DECISION USE</span><span>PRIORITY</span></div>{rows.map((row) => <div className="table-row" key={row[0]}><span><strong>{row[0]}</strong></span><span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span><Badge tone={row[4] === "High" ? "renew" : "gold"}>{row[4]}</Badge></div>)}</div><div className="method-notes"><div><Database size={16} /><div><strong>Data contract</strong><span>Store exposure, consent, cost and outcome events at a joinable grain. Keep sponsor-level fields separate from public context.</span></div></div><div><ShieldCheck size={16} /><div><strong>Governance</strong><span>Use de-identified matching or clean-room workflows where personal data crosses rights-holder and sponsor systems.</span></div></div><div><TrendingUp size={16} /><div><strong>Model validation</strong><span>Benchmark against a simple baseline, inspect pre-trends, bootstrap the lift range, and show the failure modes.</span></div></div></div></section>;
}
