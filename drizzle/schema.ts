import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const channelMetrics = mysqlTable("channel_metrics", {
  id: int("id").autoincrement().primaryKey(),
  channel: varchar("channel", { length: 64 }).notNull().unique(),
  revenueM: decimal("revenueM", { precision: 12, scale: 2 }).notNull(),
  profitM: decimal("profitM", { precision: 12, scale: 2 }).notNull(),
  growthPct: decimal("growthPct", { precision: 8, scale: 2 }).notNull(),
  marginPct: decimal("marginPct", { precision: 8, scale: 2 }).notNull(),
  cac: decimal("cac", { precision: 10, scale: 2 }).notNull(),
  repeatPct: decimal("repeatPct", { precision: 8, scale: 2 }).notNull(),
  newRatePct: decimal("newRatePct", { precision: 8, scale: 2 }).notNull(),
  roiPct: decimal("roiPct", { precision: 8, scale: 2 }).notNull(),
  color: varchar("color", { length: 16 }).notNull(),
  dataStatus: mysqlEnum("dataStatus", ["simulated", "public_proxy", "observed"]).default("simulated").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const activationMetrics = mysqlTable("activation_metrics", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull().unique(),
  attendance: int("attendance").notNull(),
  leads: int("leads").notNull(),
  conversions: int("conversions").notNull(),
  roiPct: decimal("roiPct", { precision: 8, scale: 2 }).notNull(),
  spendM: decimal("spendM", { precision: 10, scale: 2 }).notNull(),
  dataStatus: mysqlEnum("dataStatus", ["simulated", "public_proxy", "observed"]).default("simulated").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const dashboardAssumptions = mysqlTable("dashboard_assumptions", {
  id: int("id").autoincrement().primaryKey(),
  assumptionKey: varchar("assumptionKey", { length: 96 }).notNull().unique(),
  assumptionValue: text("assumptionValue").notNull(),
  sourceType: mysqlEnum("sourceType", ["public_context", "public_proxy", "simulated_model", "decision_rule"]).notNull(),
  explanation: text("explanation").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChannelMetric = typeof channelMetrics.$inferSelect;
export type ActivationMetric = typeof activationMetrics.$inferSelect;
export const refreshRuns = mysqlTable("refresh_runs", {
  id: int("id").autoincrement().primaryKey(),
  sourceKey: varchar("sourceKey", { length: 96 }).notNull(),
  sourceUrl: text("sourceUrl").notNull(),
  sourcePeriod: varchar("sourcePeriod", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["success", "skipped", "failed"]).notNull(),
  recordCount: int("recordCount").notNull().default(0),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const dashboardAuditLogs = mysqlTable("dashboard_audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  actorUserId: int("actorUserId").notNull(),
  entityType: varchar("entityType", { length: 32 }).notNull(),
  entityKey: varchar("entityKey", { length: 128 }).notNull(),
  action: mysqlEnum("action", ["update"]).notNull(),
  beforeJson: text("beforeJson").notNull(),
  afterJson: text("afterJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const decisionRegister = mysqlTable("decision_register", {
  id: int("id").autoincrement().primaryKey(),
  assetKey: varchar("assetKey", { length: 128 }).notNull(),
  owner: varchar("owner", { length: 128 }).notNull(),
  status: mysqlEnum("status", ["open", "in_review", "approved", "blocked", "closed"]).default("open").notNull(),
  deadline: timestamp("deadline").notNull(),
  approvalOutcome: mysqlEnum("approvalOutcome", ["pending", "renew", "renegotiate", "test", "exit"]).default("pending").notNull(),
  evidenceStatus: mysqlEnum("evidenceStatus", ["missing", "partial", "ready"]).default("missing").notNull(),
  rationale: text("rationale").notNull(),
  nextAction: text("nextAction").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const sponsorshipEvidence = mysqlTable("sponsorship_evidence", {
  id: int("id").autoincrement().primaryKey(),
  sourceType: mysqlEnum("sourceType", ["exposure", "crm", "qr", "retail"]).notNull(),
  externalId: varchar("externalId", { length: 128 }).notNull(),
  assetKey: varchar("assetKey", { length: 128 }).notNull(),
  market: varchar("market", { length: 96 }),
  eventDate: timestamp("eventDate").notNull(),
  metric: varchar("metric", { length: 96 }).notNull(),
  metricValue: decimal("metricValue", { precision: 14, scale: 4 }).notNull(),
  consented: mysqlEnum("consented", ["yes", "no", "not_applicable"]).default("not_applicable").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const marketObservations = mysqlTable("market_observations", {
  id: int("id").autoincrement().primaryKey(),
  market: varchar("market", { length: 96 }).notNull(),
  periodKey: varchar("periodKey", { length: 32 }).notNull(),
  periodStage: mysqlEnum("periodStage", ["pre", "post"]).notNull(),
  groupType: mysqlEnum("groupType", ["treatment", "control"]).notNull(),
  outcomeValue: decimal("outcomeValue", { precision: 14, scale: 4 }).notNull(),
  sampleSize: int("sampleSize").notNull().default(1),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DashboardAssumption = typeof dashboardAssumptions.$inferSelect;
export type DashboardAuditLog = typeof dashboardAuditLogs.$inferSelect;
export type RefreshRun = typeof refreshRuns.$inferSelect;
export type DecisionRegisterItem = typeof decisionRegister.$inferSelect;
export type SponsorshipEvidence = typeof sponsorshipEvidence.$inferSelect;
export type MarketObservation = typeof marketObservations.$inferSelect;
