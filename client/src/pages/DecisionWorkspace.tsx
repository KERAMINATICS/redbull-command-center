import { useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, CircleAlert, Clock3, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { sponsorshipData } from "@/data/sponsorshipData";

const demoDecisions = sponsorshipData.assets.slice(0, 6).map((asset, index) => ({
  id: -(index + 1),
  assetKey: asset.asset,
  owner: ["Anika Rao", "Karan Mehta", "Priya Shah", "Vikram Sethi", "Maya Iyer", "Arjun Nair"][index],
  status: index < 2 ? "in_review" : "open",
  deadline: new Date(`2026-10-${String(12 + index).padStart(2, "0")}T00:00:00Z`),
  approvalOutcome: index === 0 ? "renew" : index === 1 ? "renegotiate" : "pending",
  evidenceStatus: index === 0 ? "partial" : "missing",
  rationale: asset.measurement_gap,
  nextAction: index === 0 ? "Validate control-market lift before renewal" : "Close the asset-level data gap",
}));

type DecisionRow = (typeof demoDecisions)[number];

function statusLabel(value: string) { return value.replace("_", " ").toUpperCase(); }
function dateLabel(value: Date | string) { return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }

export default function DecisionWorkspace() {
  const utils = trpc.useUtils();
  const query = trpc.dashboard.decisions.useQuery();
  const create = trpc.dashboard.createDecision.useMutation({ onSuccess: () => { toast.success("Decision added to the register"); utils.dashboard.decisions.invalidate(); }, onError: (error) => toast.error(error.message) });
  const update = trpc.dashboard.updateDecision.useMutation({ onSuccess: () => { toast.success("Decision updated"); utils.dashboard.decisions.invalidate(); }, onError: (error) => toast.error(error.message) });
  const rows: DecisionRow[] = query.data && query.data.length > 0 ? query.data.map((row) => ({ ...row, deadline: row.deadline })) as DecisionRow[] : demoDecisions;
  const [selectedId, setSelectedId] = useState(rows[0]?.id ?? -1);
  const selected = rows.find((row) => row.id === selectedId) ?? rows[0];
  const [showForm, setShowForm] = useState(false);
  const [assetKey, setAssetKey] = useState<string>(sponsorshipData.assets[0].asset);
  const [owner, setOwner] = useState("Commercial lead");
  const [deadline, setDeadline] = useState("2025-10-20");
  const [nextAction, setNextAction] = useState("Define the evidence required for the next rights meeting");
  const [rationale, setRationale] = useState("Decision requires measured incremental value before budget is released.");
  const live = Boolean(query.data && query.data.length > 0);
  const summary = useMemo(() => ({ open: rows.filter((row) => row.status === "open" || row.status === "in_review").length, ready: rows.filter((row) => row.evidenceStatus === "ready").length, overdue: rows.filter((row) => new Date(row.deadline).getTime() < Date.now() && row.status !== "closed").length }), [rows]);

  const saveDecision = () => {
    create.mutate({ assetKey, owner, deadline, nextAction, rationale, status: "open", approvalOutcome: "pending", evidenceStatus: "missing" });
    setShowForm(false);
  };

  return <section className="page-section decision-workspace"><div className="section-title"><div><span className="kicker">06 / DECISION REGISTER</span><h2>Turn the readout into accountable action.</h2></div><button className="primary-action" onClick={() => setShowForm((value) => !value)}><Plus size={15} /> New decision</button></div>
    <div className="decision-summary"><div><span>OPEN WORK</span><strong>{summary.open}</strong><small>decisions needing an owner</small></div><div><span>EVIDENCE READY</span><strong>{summary.ready}</strong><small>assets with a usable proof trail</small></div><div><span>DEADLINE RISK</span><strong className={summary.overdue ? "risk-number" : ""}>{summary.overdue}</strong><small>overdue before approval</small></div><div className="live-state"><ShieldCheck size={17} /><span><b>{live ? "LIVE REGISTER" : "DEMO REGISTER"}</b>{live ? " persisted in the project database" : " sign in to persist changes"}</span></div></div>
    {showForm && <div className="panel decision-form"><div><span className="kicker">NEW DECISION</span><h3>Assign the next action before the meeting ends.</h3></div><div className="form-grid"><label>Asset<select value={assetKey} onChange={(event) => setAssetKey(event.target.value)}>{sponsorshipData.assets.map((asset) => <option key={asset.asset}>{asset.asset}</option>)}</select></label><label>Owner<input value={owner} onChange={(event) => setOwner(event.target.value)} /></label><label>Deadline<input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label><label className="wide-field">Next action<input value={nextAction} onChange={(event) => setNextAction(event.target.value)} /></label><label className="wide-field">Rationale<textarea value={rationale} onChange={(event) => setRationale(event.target.value)} rows={3} /></label></div><div className="form-actions"><button className="text-action" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-action" disabled={create.isPending} onClick={saveDecision}>Save decision <ArrowUpRight size={15} /></button></div></div>}
    <div className="decision-layout register-layout"><div className="panel register-table"><div className="panel-heading"><div><span className="kicker">ACCOUNTABILITY QUEUE</span><h3>Every recommendation needs an owner.</h3></div><span className="section-note">{rows.length} tracked decisions</span></div>{rows.map((row) => <button key={row.id} className={`decision-row ${selected?.id === row.id ? "active" : ""}`} onClick={() => setSelectedId(row.id)}><span className="decision-asset"><strong>{row.assetKey}</strong><small>{row.owner} · due {dateLabel(row.deadline)}</small></span><span className={`decision-status status-${row.status}`}><Clock3 size={12} /> {statusLabel(row.status)}</span><span className={`evidence-pill evidence-${row.evidenceStatus}`}>{statusLabel(row.evidenceStatus)}</span><span className="decision-outcome">{row.approvalOutcome === "pending" ? "PENDING" : row.approvalOutcome.toUpperCase()}</span></button>)}</div><div className="panel decision-detail">{selected && <><div className="detail-header"><span className="kicker">SELECTED DECISION / {selected.assetKey.toUpperCase()}</span><span className={`decision-status status-${selected.status}`}>{statusLabel(selected.status)}</span></div><h3>{selected.nextAction}</h3><p>{selected.rationale}</p><div className="decision-meta"><div><span>Owner</span><strong>{selected.owner}</strong></div><div><span>Deadline</span><strong>{dateLabel(selected.deadline)}</strong></div><div><span>Evidence</span><strong>{statusLabel(selected.evidenceStatus)}</strong></div><div><span>Approval</span><strong>{statusLabel(selected.approvalOutcome)}</strong></div></div><div className="detail-callout"><CircleAlert size={16} /><span>Approval is not complete until the proof trail is linked to this decision.</span></div><div className="decision-controls"><label>Status<select value={selected.status} onChange={(event) => update.mutate({ id: selected.id, patch: { status: event.target.value as "open" | "in_review" | "approved" | "blocked" | "closed" } })}><option value="open">Open</option><option value="in_review">In review</option><option value="approved">Approved</option><option value="blocked">Blocked</option><option value="closed">Closed</option></select></label><label>Approval outcome<select value={selected.approvalOutcome} onChange={(event) => update.mutate({ id: selected.id, patch: { approvalOutcome: event.target.value as "pending" | "renew" | "renegotiate" | "test" | "exit" } })}><option value="pending">Pending</option><option value="renew">Renew</option><option value="renegotiate">Renegotiate</option><option value="test">Test</option><option value="exit">Exit</option></select></label><label>Evidence status<select value={selected.evidenceStatus} onChange={(event) => update.mutate({ id: selected.id, patch: { evidenceStatus: event.target.value as "missing" | "partial" | "ready" } })}><option value="missing">Missing</option><option value="partial">Partial</option><option value="ready">Ready</option></select></label></div><div className="approval-track"><CheckCircle2 size={16} /><span>Decision path: assigned → evidence linked → commercial approval → renewal action</span></div></>}</div></div>
  </section>;
}
