import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("dashboard.data", () => {
  it("returns persisted dashboard collections with disclosure-compatible statuses", async () => {
    const ctx = {
      user: undefined,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    } satisfies TrpcContext;

    const result = await appRouter.createCaller(ctx).dashboard.data();

    expect(result).toHaveProperty("channels");
    expect(result).toHaveProperty("activations");
    expect(result).toHaveProperty("assumptions");
    expect(Array.isArray(result.channels)).toBe(true);
    expect(Array.isArray(result.activations)).toBe(true);
    expect(Array.isArray(result.assumptions)).toBe(true);

    for (const row of result.channels) {
      expect(["simulated", "public_proxy", "observed"]).toContain(row.dataStatus);
    }
  });
});
