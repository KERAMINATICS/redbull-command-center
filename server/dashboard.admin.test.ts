import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("dashboard admin mutations", () => {
  it("rejects non-admin edits before touching the database", async () => {
    const ctx = {
      user: {
        id: 2,
        openId: "portfolio-viewer",
        name: "Portfolio Viewer",
        email: "viewer@example.com",
        loginMethod: "test",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    } satisfies TrpcContext;

    await expect(appRouter.createCaller(ctx).dashboard.updateChannel({ id: 1, patch: { roiPct: "41.00" } })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
