import { describe, expect, it } from "vitest";
import { sponsorshipData } from "../client/src/data/sponsorshipData";

describe("IPL sponsorship valuation model", () => {
  it("keeps the asset inventory complete and quality scores bounded", () => {
    expect(sponsorshipData.assets).toHaveLength(8);
    expect(sponsorshipData.assets.every((asset) => asset.quality_score >= 0 && asset.quality_score <= 1)).toBe(true);
    expect(new Set(sponsorshipData.assets.map((asset) => asset.asset)).size).toBe(8);
    expect(sponsorshipData.assets.every((asset) => ["High quality", "Medium quality", "Low quality"].includes(asset.quality_band))).toBe(true);
  });

  it("exposes all three attribution cases for every asset", () => {
    expect(new Set(sponsorshipData.scenarios.map((row) => row.case))).toEqual(new Set(["Direct", "Assisted + retail", "Control-market lift"]));
    for (const asset of sponsorshipData.assets) {
      expect(sponsorshipData.scenarios.filter((row) => row.asset === asset.asset)).toHaveLength(3);
    }
  });

  it("uses control-lift contribution, not media-equivalent value, for portfolio ROI", () => {
    const controlLiftTotal = sponsorshipData.assets.reduce((sum, asset) => sum + asset.control_lift_m, 0);
    const expectedRoi = ((sponsorshipData.portfolio.commercial_value_m - sponsorshipData.portfolio.rights_fee_m) / sponsorshipData.portfolio.rights_fee_m) * 100;
    expect(sponsorshipData.portfolio.commercial_value_m).toBeCloseTo(controlLiftTotal, 1);
    expect(sponsorshipData.portfolio.commercial_roi_pct).toBeCloseTo(expectedRoi, 1);
    expect(sponsorshipData.portfolio.fee_coverage_pct).toBeCloseTo((controlLiftTotal / sponsorshipData.portfolio.rights_fee_m) * 100, 1);
    expect(sponsorshipData.portfolio.media_value_m).toBeGreaterThan(sponsorshipData.portfolio.commercial_value_m);
  });

  it("never treats synthetic quality or outcome fields as approval to renew, scale, or exit", () => {
    for (const asset of sponsorshipData.assets) {
      expect(["RENEW / SCALE", "EXIT / REPLACE"]).not.toContain(asset.recommendation);
      expect(asset.recommendation).toBe(asset.quality_score >= 0.62 ? "TEST / MEASURE" : "RENEGOTIATE / HOLD");
    }
  });

  it("keeps uncertainty labeled as a modeled decision range", () => {
    expect(sponsorshipData.method.uncertainty).toContain("not a real-world confidence interval");
    expect(sponsorshipData.uncertainty.p10).toBeLessThan(sponsorshipData.uncertainty.p50);
    expect(sponsorshipData.uncertainty.p50).toBeLessThan(sponsorshipData.uncertainty.p90);
  });
});
