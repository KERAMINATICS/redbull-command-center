import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createDecision, getDashboardData, getDecisionRegister, getEvidenceSummary, getMarketEstimate, insertEvidence, insertMarketObservations, updateActivationMetric, updateChannelMetric, updateDashboardAssumption, updateDecision } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  dashboard: router({
    data: publicProcedure.query(() => getDashboardData()),
    decisions: publicProcedure.query(() => getDecisionRegister()),
    evidence: publicProcedure.query(() => getEvidenceSummary()),
    marketEstimate: publicProcedure.query(() => getMarketEstimate()),
    createDecision: protectedProcedure.input(z.object({ assetKey: z.string().min(1), owner: z.string().min(1), status: z.enum(["open", "in_review", "approved", "blocked", "closed"]).default("open"), deadline: z.coerce.date(), approvalOutcome: z.enum(["pending", "renew", "renegotiate", "test", "exit"]).default("pending"), evidenceStatus: z.enum(["missing", "partial", "ready"]).default("missing"), rationale: z.string().min(1), nextAction: z.string().min(1) })).mutation(({ ctx, input }) => createDecision({ ...input, createdBy: ctx.user.id })),
    updateDecision: protectedProcedure.input(z.object({ id: z.number().int().positive(), patch: z.object({ owner: z.string().min(1).optional(), status: z.enum(["open", "in_review", "approved", "blocked", "closed"]).optional(), deadline: z.coerce.date().optional(), approvalOutcome: z.enum(["pending", "renew", "renegotiate", "test", "exit"]).optional(), evidenceStatus: z.enum(["missing", "partial", "ready"]).optional(), rationale: z.string().min(1).optional(), nextAction: z.string().min(1).optional() }) })).mutation(({ input }) => updateDecision(input.id, input.patch)),
    ingestEvidence: protectedProcedure.input(z.object({ rows: z.array(z.object({ sourceType: z.enum(["exposure", "crm", "qr", "retail"]), externalId: z.string().min(1), assetKey: z.string().min(1), market: z.string().optional(), eventDate: z.coerce.date(), metric: z.string().min(1), metricValue: z.number().finite(), consented: z.enum(["yes", "no", "not_applicable"]).default("not_applicable") })).min(1).max(5000) })).mutation(({ ctx, input }) => insertEvidence(input.rows.map((row) => ({ ...row, metricValue: String(row.metricValue), createdBy: ctx.user.id })))),
    ingestMarketObservations: protectedProcedure.input(z.object({ rows: z.array(z.object({ market: z.string().min(1), periodKey: z.string().min(1), periodStage: z.enum(["pre", "post"]), groupType: z.enum(["treatment", "control"]), outcomeValue: z.number().finite(), sampleSize: z.number().int().positive().default(1) })).min(4).max(5000) })).mutation(({ ctx, input }) => insertMarketObservations(input.rows.map((row) => ({ ...row, outcomeValue: String(row.outcomeValue), createdBy: ctx.user.id })))),
    updateChannel: protectedProcedure.input(z.object({ id: z.number().int().positive(), patch: z.object({ revenueM: z.string().optional(), profitM: z.string().optional(), growthPct: z.string().optional(), marginPct: z.string().optional(), cac: z.string().optional(), repeatPct: z.string().optional(), newRatePct: z.string().optional(), roiPct: z.string().optional() }) })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return updateChannelMetric(input.id, input.patch, ctx.user.id);
    }),
    updateActivation: protectedProcedure.input(z.object({ id: z.number().int().positive(), patch: z.object({ attendance: z.number().int().nonnegative().optional(), leads: z.number().int().nonnegative().optional(), conversions: z.number().int().nonnegative().optional(), roiPct: z.string().optional(), spendM: z.string().optional() }) })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return updateActivationMetric(input.id, input.patch, ctx.user.id);
    }),
    updateAssumption: protectedProcedure.input(z.object({ id: z.number().int().positive(), patch: z.object({ assumptionValue: z.string().min(1).optional(), explanation: z.string().min(1).optional() }) })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return updateDashboardAssumption(input.id, input.patch, ctx.user.id);
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
