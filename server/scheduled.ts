import type { Request, Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import { dashboardAssumptions, refreshRuns } from "../drizzle/schema";
import { getDb } from "./db";
import { sdk } from "./_core/sdk";

const SOURCE_KEY = "india_cpi_context";
const SOURCE_URL = "https://esankhyiki.mospi.gov.in/macroindicators?product=cpi&tab=metadata";

export async function refreshPublicContext(req: Request, res: Response) {
  const startedAt = new Date();
  const sourcePeriod = startedAt.toISOString().slice(0, 7);
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });

    const db = await getDb();
    if (!db) return res.status(503).json({ error: "database-unavailable" });

    const prior = await db.select().from(refreshRuns)
      .where(and(eq(refreshRuns.sourceKey, SOURCE_KEY), eq(refreshRuns.sourcePeriod, sourcePeriod)))
      .orderBy(desc(refreshRuns.id)).limit(1);
    if (prior[0]?.status === "success") {
      await db.insert(refreshRuns).values({ sourceKey: SOURCE_KEY, sourceUrl: SOURCE_URL, sourcePeriod, status: "skipped", recordCount: 0, errorMessage: "Monthly source already refreshed" });
      return res.json({ ok: true, skipped: "already-refreshed", sourcePeriod });
    }

    const response = await fetch(SOURCE_URL, { headers: { "User-Agent": "Red Bull India portfolio dashboard context refresh" }, signal: AbortSignal.timeout(15_000) });
    const body = await response.text();
    const valid = response.ok && /consumer price index|cpi/i.test(body);
    if (!valid) {
      await db.insert(refreshRuns).values({ sourceKey: SOURCE_KEY, sourceUrl: SOURCE_URL, sourcePeriod, status: "failed", recordCount: 0, errorMessage: `Source validation failed with status ${response.status}` });
      return res.status(502).json({ error: "source-validation-failed", sourcePeriod });
    }

    await db.insert(dashboardAssumptions).values({
      assumptionKey: "india_cpi_context_last_checked",
      assumptionValue: `${sourcePeriod} · official MOSPI CPI metadata page validated`,
      sourceType: "public_context",
      explanation: `Monthly source check completed from ${SOURCE_URL}. This is context only and does not represent Red Bull performance.`,
    }).onDuplicateKeyUpdate({ set: { assumptionValue: `${sourcePeriod} · official MOSPI CPI metadata page validated`, explanation: `Monthly source check completed from ${SOURCE_URL}. This is context only and does not represent Red Bull performance.` } });

    await db.insert(refreshRuns).values({ sourceKey: SOURCE_KEY, sourceUrl: SOURCE_URL, sourcePeriod, status: "success", recordCount: 1 });
    return res.json({ ok: true, sourceKey: SOURCE_KEY, sourcePeriod, recordCount: 1 });
  } catch (error) {
    console.error("[Scheduled refresh] Failed", error);
    return res.status(500).json({ error: String(error), context: { url: req.originalUrl, timestamp: startedAt.toISOString() } });
  }
}
