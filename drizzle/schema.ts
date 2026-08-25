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
export type DashboardAssumption = typeof dashboardAssumptions.$inferSelect;