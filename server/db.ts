import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { activationMetrics, channelMetrics, dashboardAssumptions, dashboardAuditLogs, InsertUser, users } from "../drizzle/schema";
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
