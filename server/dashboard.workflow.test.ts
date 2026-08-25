import { afterEach, describe, expect, it, vi } from "vitest";
import { eq } from "drizzle-orm";
import { activationMetrics, channelMetrics, dashboardAssumptions, dashboardAuditLogs, refreshRuns } from "../drizzle/schema";
import { getDb } from "./db";
import { refreshPublicContext } from "./scheduled";
import { appRouter } from "./routers";
import { sdk } from "./_core/sdk";
import type { TrpcContext } from "./_core/context";

const adminContext = {
  user: { id: 1, openId: "owner", name: "Owner", email: "owner@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
} satisfies TrpcContext;

const viewerContext = { ...adminContext, user: { ...adminContext.user, id: 2, role: "user" as const } } satisfies TrpcContext;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("dashboard admin workflow", () => {
  it("rejects invalid inputs for all mutation surfaces", async () => {
    const caller = appRouter.createCaller(adminContext);
    await expect(caller.dashboard.updateChannel({ id: 1, patch: { roiPct: 41 as unknown as string } })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.dashboard.updateActivation({ id: 1, patch: { attendance: -1 } })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.dashboard.updateAssumption({ id: 1, patch: { assumptionValue: "" } })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("changes the persisted value and appends one auditable before/after record", async () => {
    const db = await getDb();
    const beforeRow = (await db!.select().from(channelMetrics).limit(1))[0];
    const beforeCount = (await db!.select().from(dashboardAuditLogs)).length;
    const result = await appRouter.createCaller(adminContext).dashboard.updateChannel({ id: beforeRow.id, patch: { roiPct: "39.21" } });
    const afterRow = (await db!.select().from(channelMetrics).where(eq(channelMetrics.id, beforeRow.id)).limit(1))[0];
    const logs = await db!.select().from(dashboardAuditLogs);
    const latest = logs.sort((a, b) => b.id - a.id)[0];
    expect(result?.roiPct).toBe("39.21");
    expect(afterRow?.roiPct).toBe("39.21");
    expect(logs).toHaveLength(beforeCount + 1);
    expect(latest?.entityType).toBe("channel_metric");
    expect(JSON.parse(latest!.beforeJson).roiPct).toBe(beforeRow.roiPct);
    expect(JSON.parse(latest!.afterJson).roiPct).toBe("39.21");
  });

  it("rejects non-admin edits before database access", async () => {
    await expect(appRouter.createCaller(viewerContext).dashboard.updateChannel({ id: 1, patch: { roiPct: "41.00" } })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("scheduled public context refresh", () => {
  it("rejects non-cron requests", async () => {
    vi.spyOn(sdk, "authenticateRequest").mockResolvedValue({ ...adminContext.user } as never);
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    await refreshPublicContext({ originalUrl: "/api/scheduled/refreshPublicContext" } as never, { status, json } as never);
    expect(status).toHaveBeenCalledWith(403);
  });

  it("validates the source, persists a refresh run, and skips a duplicate month", async () => {
    vi.spyOn(sdk, "authenticateRequest").mockResolvedValue({ ...adminContext.user, isCron: true, taskUid: "cron-test" } as never);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Consumer Price Index (CPI) metadata", { status: 200 })));
    const responses: Array<Record<string, unknown>> = [];
    const makeResponse = () => ({ status: (code: number) => ({ json: (body: Record<string, unknown>) => { responses.push({ code, ...body }); return body; } }), json: (body: Record<string, unknown>) => { responses.push({ code: 200, ...body }); return body; } });
    await refreshPublicContext({ originalUrl: "/api/scheduled/refreshPublicContext" } as never, makeResponse() as never);
    await refreshPublicContext({ originalUrl: "/api/scheduled/refreshPublicContext" } as never, makeResponse() as never);
    const db = await getDb();
    const runs = await db!.select().from(refreshRuns);
    expect(runs.some((run) => run.sourceKey === "india_cpi_context" && run.status === "success")).toBe(true);
    expect(runs.some((run) => run.sourceKey === "india_cpi_context" && run.status === "skipped" && run.errorMessage === "Monthly source already refreshed")).toBe(true);
    expect(responses.some((item) => item.skipped === "already-refreshed")).toBe(true);
  });
});
