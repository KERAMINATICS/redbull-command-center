import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: {
      id: 11,
      openId: "measurement-user",
      email: "measurement@example.com",
      name: "Measurement User",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("measurement workflow validation", () => {
  it("rejects market uploads that do not include all required observation cells", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.dashboard.ingestMarketObservations({ rows: [
      { market: "Mumbai", periodKey: "2025-W10", periodStage: "pre", groupType: "treatment", outcomeValue: 100, sampleSize: 1 },
      { market: "Mumbai", periodKey: "2025-W11", periodStage: "post", groupType: "treatment", outcomeValue: 110, sampleSize: 1 },
      { market: "Pune", periodKey: "2025-W10", periodStage: "pre", groupType: "control", outcomeValue: 98, sampleSize: 1 },
    ] as never })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects decision records without an owner or next action", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.dashboard.createDecision({
      assetKey: "Jersey front",
      owner: "",
      deadline: "2025-10-20",
      rationale: "Needs review",
      nextAction: "",
    } as never)).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
