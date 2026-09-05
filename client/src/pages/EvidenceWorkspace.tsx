import { useMemo, useState } from "react";
import { Activity, ArrowUpRight, CheckCircle2, Database, FileUp, LockKeyhole, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const evidenceTemplate = `sourceType,externalId,assetKey,market,eventDate,metric,metricValue,consented\nexposure,match-001,Jersey front,Mumbai,2025-04-01T20:00:00Z,quality_contacts,125000,not_applicable`;
const marketTemplate = `market,periodKey,periodStage,groupType,outcomeValue,sampleSize\nMumbai,2025-W10,pre,treatment,102.4,1\nMumbai,2025-W11,post,treatment,119.7,1\nPune,2025-W10,pre,control,98.2,1\nPune,2025-W11,post,control,101.1,1`;

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [] as Record<string, string>[];
  const headers = lines[0].split(",").map((header) => header.trim());
  return lines.slice(1).map((line) => line.split(",").map((value) => value.trim()).reduce<Record<string, string>>((row, value, index) => { row[headers[index]] = value; return row; }, {}));
}

export default function EvidenceWorkspace() {
  const utils = trpc.useUtils();
  const evidence = trpc.dashboard.evidence.useQuery();
  const estimate = trpc.dashboard.marketEstimate.useQuery();
  const ingestEvidence = trpc.dashboard.ingestEvidence.useMutation({ onSuccess: (result) => { toast.success(`${result.inserted} evidence records ingested`); utils.dashboard.evidence.invalidate(); }, onError: (error) => toast.error(error.message) });
  const ingestMarket = trpc.dashboard.ingestMarketObservations.useMutation({ onSuccess: (result) => { toast.success(`${result.inserted} market observations ingested`); utils.dashboard.marketEstimate.invalidate(); }, onError: (error) => toast.error(error.message) });
  const [evidenceCsv, setEvidenceCsv] = useState("");
  const [marketCsv, setMarketCsv] = useState("");
  const [evidenceFileName, setEvidenceFileName] = useState("");
  const [marketFileName, setMarketFileName] = useState("");
  const evidenceRows = useMemo(() => parseCsv(evidenceCsv), [evidenceCsv]);
  const marketRows = useMemo(() => parseCsv(marketCsv), [marketCsv]);
  const totals = evidence.data?.totals ?? [];
  const totalRecords = evidence.data?.totalRecords ?? 0;
  const consented = evidence.data?.consentedRecords ?? 0;
  const loadFile = (file: File, setter: (text: string) => void, nameSetter: (name: string) => void) => { nameSetter(file.name); const reader = new FileReader(); reader.onload = () => setter(String(reader.result ?? "")); reader.readAsText(file); };
  const uploadEvidence = () => {
    const rows = evidenceRows.map((row) => ({ sourceType: row.sourceType as "exposure" | "crm" | "qr" | "retail", externalId: row.externalId, assetKey: row.assetKey, market: row.market || undefined, eventDate: row.eventDate, metric: row.metric, metricValue: Number(row.metricValue), consented: (row.consented || "not_applicable") as "yes" | "no" | "not_applicable" }));
    if (rows.some((row) => !row.externalId || !row.assetKey || !row.eventDate || !row.metric || !Number.isFinite(row.metricValue))) return toast.error("Evidence CSV has missing or invalid required fields");
    ingestEvidence.mutate({ rows });
  };
  const uploadMarket = () => {
    const rows = marketRows.map((row) => ({ market: row.market, periodKey: row.periodKey, periodStage: row.periodStage as "pre" | "post", groupType: row.groupType as "treatment" | "control", outcomeValue: Number(row.outcomeValue), sampleSize: Number(row.sampleSize || 1) }));
    if (rows.some((row) => !row.market || !row.periodKey || !["pre", "post"].includes(row.periodStage) || !["treatment", "control"].includes(row.groupType) || !Number.isFinite(row.outcomeValue))) return toast.error("Market CSV has missing or invalid required fields");
    ingestMarket.mutate({ rows });
  };
  const result = estimate.data?.estimate;
  return <section className="page-section evidence-workspace"><div className="section-title"><div><span className="kicker">07 / EVIDENCE & INCREMENTALITY</span><h2>Connect the proof trail to the decision.</h2></div><span className="section-note">CSV/API-ready ingestion · no simulated observations</span></div>
    <div className="evidence-summary"><div><span>LIVE RECORDS</span><strong>{totalRecords}</strong><small>exposure · CRM · QR · retail</small></div><div><span>CONSENTED LINKS</span><strong>{consented}</strong><small>customer-level joins marked yes</small></div><div><span>MARKET OBSERVATIONS</span><strong>{estimate.data?.observations?.length ?? 0}</strong><small>pre / post treatment-control rows</small></div><div className="privacy-note"><LockKeyhole size={16} /><span><b>Privacy boundary</b> Upload de-identified IDs and consent flags only.</span></div></div>
    <div className="ingest-grid"><div className="panel ingest-card"><div className="panel-heading"><div><span className="kicker">SOURCE FEED / 01</span><h3>Exposure, CRM, QR and retail</h3></div><Database size={18} color="#33b9c8" /></div><p className="ingest-copy">Normalize each source to one event grain so an asset can be traced from visibility to commercial outcome.</p><div className="source-badges">{["exposure", "crm", "qr", "retail"].map((source) => <span key={source}>{source}</span>)}</div><label className="file-drop"><FileUp size={18} /><span>{evidenceFileName || "Choose evidence CSV"}<small>sourceType, externalId, assetKey, market, eventDate, metric, metricValue, consented</small></span><input type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && loadFile(event.target.files[0], setEvidenceCsv, setEvidenceFileName)} /></label><textarea className="csv-preview" value={evidenceCsv} onChange={(event) => setEvidenceCsv(event.target.value)} placeholder={evidenceTemplate} rows={5} /><div className="ingest-footer"><span>{evidenceRows.length} rows detected</span><button className="primary-action" disabled={!evidenceRows.length || ingestEvidence.isPending} onClick={uploadEvidence}><UploadCloud size={15} /> Ingest evidence</button></div><div className="source-total-list">{totals.map((row) => <div key={row.sourceType}><span>{row.sourceType}</span><strong>{row.records}</strong><small>{row.metricTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })} metric total</small></div>)}</div></div><div className="panel ingest-card"><div className="panel-heading"><div><span className="kicker">CAUSAL FEED / 02</span><h3>Treatment-control market upload</h3></div><Activity size={18} color="#e33b52" /></div><p className="ingest-copy">Upload pre/post outcomes for matched treatment and control markets. The server returns a difference-in-differences estimate and bootstrap interval.</p><div className="causal-steps"><span>01 / PRE-TREND</span><span>02 / POST-LIFT</span><span>03 / BOOTSTRAP CI</span></div><label className="file-drop"><FileUp size={18} /><span>{marketFileName || "Choose market observations CSV"}<small>market, periodKey, periodStage, groupType, outcomeValue, sampleSize</small></span><input type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && loadFile(event.target.files[0], setMarketCsv, setMarketFileName)} /></label><textarea className="csv-preview" value={marketCsv} onChange={(event) => setMarketCsv(event.target.value)} placeholder={marketTemplate} rows={5} /><div className="ingest-footer"><span>{marketRows.length} rows detected</span><button className="primary-action" disabled={marketRows.length < 4 || ingestMarket.isPending} onClick={uploadMarket}><UploadCloud size={15} /> Upload market data</button></div><div className={`estimate-result ${result ? "ready" : "empty"}`}>{result ? <><div><span>INCREMENTAL LIFT / DID</span><strong>{result.did.toFixed(2)}</strong><small>95% bootstrap interval {result.ciLow.toFixed(2)} to {result.ciHigh.toFixed(2)} · {result.bootstrapRuns.toLocaleString()} resamples</small></div><CheckCircle2 size={22} /></> : <><div><span>WAITING FOR REAL OBSERVATIONS</span><strong>—</strong><small>At least one pre and post row for both treatment and control is required.</small></div><ArrowUpRight size={18} /></>}</div></div></div>
    <div className="panel measurement-contract"><div><span className="kicker">REQUIRED DATA CONTRACT</span><h3>One asset ID. Four proof layers. One approval decision.</h3></div><div className="contract-grid"><span>01 <b>Exposure</b><small>placement, duration, reach, frequency</small></span><span>02 <b>CRM</b><small>consented lead or conversion join</small></span><span>03 <b>QR / digital</b><small>scan, click, completion, coupon</small></span><span>04 <b>Retail</b><small>sell-out, margin, stockout, market</small></span></div></div>
  </section>;
}
