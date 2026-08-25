import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDashboardData, updateActivationMetric, updateChannelMetric, updateDashboardAssumption } from "./db";

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
