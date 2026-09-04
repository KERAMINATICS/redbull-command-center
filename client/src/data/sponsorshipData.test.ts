import { describe, expect, it } from "vitest";
import { sponsorshipData } from "./sponsorshipData";

describe("IPL sponsorship valuation model", () => {
  it("keeps the asset inventory complete and quality scores bounded", () => {
    expect(sponsorshipData.assets).toHaveLength(8);
    expect(sponsorshipData.assets.every((asset) => asset.quality_score >= 0 && asset.quality_score <= 1)).toBe(true);
    expect(new Set(sponsorshipData.assets.map((asset) => asset.asset)).size).toBe(8);
  });

  it("exposes all three attribution cases for every asset", () => {
    expect(new Set(sponsorshipData.scenarios.map((row) => row.case))).toEqual(new Set(["Direct", "Assisted + retail", "Control-market lift"]));
    for (const asset of sponsorshipData.assets) {
      expect(sponsorshipData.scenarios.filter((row) => row.asset === asset.asset)).toHaveLength(3);
    }
  });

  it("keeps uncertainty labeled as a modeled decision range", () => {
    expect(sponsorshipData.method.uncertainty).toContain("not a real-world confidence interval");
    expect(sponsorshipData.uncertainty.p10).toBeLessThan(sponsorshipData.uncertainty.p50);
    expect(sponsorshipData.uncertainty.p50).toBeLessThan(sponsorshipData.uncertainty.p90);
  });
});
