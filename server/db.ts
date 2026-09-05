import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { activationMetrics, channelMetrics, dashboardAssumptions, dashboardAuditLogs, decisionRegister, InsertUser, marketObservations, sponsorshipEvidence, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateChannelMetric(id: number, patch: Partial<typeof channelMetrics.$inferInsert>, actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const before = (await db.select().from(channelMetrics).where(eq(channelMetrics.id, id)).limit(1))[0];
  if (!before) throw new Error("Channel metric not found");
  await db.update(channelMetrics).set(patch).where(eq(channelMetrics.id, id));
  const after = (await db.select().from(channelMetrics).where(eq(channelMetrics.id, id)).limit(1))[0];
  await db.insert(dashboardAuditLogs).values({ actorUserId, entityType: "channel_metric", entityKey: String(id), action: "update", beforeJson: JSON.stringify(before), afterJson: JSON.stringify(after) });
  return after;
}

export async function updateActivationMetric(id: number, patch: Partial<typeof activationMetrics.$inferInsert>, actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const before = (await db.select().from(activationMetrics).where(eq(activationMetrics.id, id)).limit(1))[0];
  if (!before) throw new Error("Activation metric not found");
  await db.update(activationMetrics).set(patch).where(eq(activationMetrics.id, id));
  const after = (await db.select().from(activationMetrics).where(eq(activationMetrics.id, id)).limit(1))[0];
  await db.insert(dashboardAuditLogs).values({ actorUserId, entityType: "activation_metric", entityKey: String(id), action: "update", beforeJson: JSON.stringify(before), afterJson: JSON.stringify(after) });
  return after;
}

export async function updateDashboardAssumption(id: number, patch: Partial<typeof dashboardAssumptions.$inferInsert>, actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const before = (await db.select().from(dashboardAssumptions).where(eq(dashboardAssumptions.id, id)).limit(1))[0];
  if (!before) throw new Error("Assumption not found");
  await db.update(dashboardAssumptions).set(patch).where(eq(dashboardAssumptions.id, id));
  const after = (await db.select().from(dashboardAssumptions).where(eq(dashboardAssumptions.id, id)).limit(1))[0];
  await db.insert(dashboardAuditLogs).values({ actorUserId, entityType: "dashboard_assumption", entityKey: String(id), action: "update", beforeJson: JSON.stringify(before), afterJson: JSON.stringify(after) });
  return after;
}

export async function getDashboardData() {
  const db = await getDb();
  if (!db) return { channels: [], activations: [], assumptions: [] };
  const [channels, activations, assumptions] = await Promise.all([
    db.select().from(channelMetrics),
    db.select().from(activationMetrics),
    db.select().from(dashboardAssumptions),
  ]);
  return { channels, activations, assumptions };
}

export async function getDecisionRegister() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(decisionRegister).orderBy(desc(decisionRegister.deadline));
}

export async function createDecision(input: typeof decisionRegister.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(decisionRegister).values(input);
  const id = Number(result[0].insertId);
  return (await db.select().from(decisionRegister).where(eq(decisionRegister.id, id)).limit(1))[0];
}

export async function updateDecision(id: number, patch: Partial<typeof decisionRegister.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(decisionRegister).set(patch).where(eq(decisionRegister.id, id));
  return (await db.select().from(decisionRegister).where(eq(decisionRegister.id, id)).limit(1))[0];
}

export async function getEvidenceSummary() {
  const db = await getDb();
  if (!db) return { totals: [], recent: [], totalRecords: 0, consentedRecords: 0 };
  const rows = await db.select().from(sponsorshipEvidence).orderBy(desc(sponsorshipEvidence.createdAt));
  const totals = ["exposure", "crm", "qr", "retail"].map((sourceType) => {
    const sourceRows = rows.filter((row) => row.sourceType === sourceType);
    return { sourceType, records: sourceRows.length, metricTotal: sourceRows.reduce((sum, row) => sum + Number(row.metricValue), 0) };
  });
  return { totals, recent: rows.slice(0, 10), totalRecords: rows.length, consentedRecords: rows.filter((row) => row.consented === "yes").length };
}

export async function insertEvidence(rows: typeof sponsorshipEvidence.$inferInsert[]) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  if (rows.length > 0) await db.insert(sponsorshipEvidence).values(rows);
  return { inserted: rows.length };
}

export async function getMarketObservations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketObservations).orderBy(marketObservations.periodKey);
}

function mean(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function estimateDid(rows: { periodStage: string; groupType: string; outcomeValue: number }[]) {
  const treatmentPre = mean(rows.filter((row) => row.periodStage === "pre" && row.groupType === "treatment").map((row) => row.outcomeValue));
  const treatmentPost = mean(rows.filter((row) => row.periodStage === "post" && row.groupType === "treatment").map((row) => row.outcomeValue));
  const controlPre = mean(rows.filter((row) => row.periodStage === "pre" && row.groupType === "control").map((row) => row.outcomeValue));
  const controlPost = mean(rows.filter((row) => row.periodStage === "post" && row.groupType === "control").map((row) => row.outcomeValue));
  return { treatmentPre, treatmentPost, controlPre, controlPost, did: treatmentPost - treatmentPre - (controlPost - controlPre) };
}

export async function getMarketEstimate() {
  const rows = await getMarketObservations();
  const normalized = rows.map((row) => ({ periodStage: row.periodStage, groupType: row.groupType, outcomeValue: Number(row.outcomeValue) }));
  const requiredCells = ["pre:treatment", "post:treatment", "pre:control", "post:control"];
  const availableCells = new Set(normalized.map((row) => `${row.periodStage}:${row.groupType}`));
  if (!requiredCells.every((cell) => availableCells.has(cell))) return { status: "insufficient_data" as const, observations: rows, estimate: null };
  const point = estimateDid(normalized);
  const byCell = requiredCells.reduce<Record<string, typeof normalized>>((acc, cell) => { acc[cell] = normalized.filter((row) => `${row.periodStage}:${row.groupType}` === cell); return acc; }, {});
  const bootstrap: number[] = [];
  for (let iteration = 0; iteration < 2000; iteration += 1) {
    const sampled = requiredCells.flatMap((cell) => {
      const cellRows = byCell[cell];
      return cellRows.map(() => cellRows[Math.floor(Math.random() * cellRows.length)]);
    });
    bootstrap.push(estimateDid(sampled).did);
  }
  bootstrap.sort((a, b) => a - b);
  const percentile = (value: number) => bootstrap[Math.min(bootstrap.length - 1, Math.floor(value * bootstrap.length))];
  return { status: "ready" as const, observations: rows, estimate: { ...point, ciLow: percentile(0.025), ciHigh: percentile(0.975), bootstrapRuns: bootstrap.length } };
}

export async function insertMarketObservations(rows: typeof marketObservations.$inferInsert[]) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  if (rows.length > 0) await db.insert(marketObservations).values(rows);
  return { inserted: rows.length };
}
