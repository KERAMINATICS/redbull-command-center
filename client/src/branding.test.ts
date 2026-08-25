import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "../..");
const homeSource = readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
const indexSource = readFileSync(resolve(projectRoot, "client/index.html"), "utf8");

describe("brand asset usage", () => {
  it("uses the supplied Red Bull asset for the primary logo and browser icon", () => {
    expect(homeSource).toContain("/manus-storage/redbull-logo_bf5849d9.png");
    expect(indexSource).toContain("rel=\"icon\"");
    expect(indexSource).toContain("redbull-logo_bf5849d9.png");
  });

  it("does not retain the previous abstract image references", () => {
    expect(homeSource).not.toContain("energy-mark_344de733.png");
    expect(homeSource).not.toContain("redbull-editorial-poster_20977792.png");
    expect(homeSource).not.toContain("activation-hero_419ef0c0.png");
  });
});
