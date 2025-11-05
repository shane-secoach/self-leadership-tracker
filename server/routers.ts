import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDailyCheckIn, createOrUpdateCheckIn, getCheckInsForWeek, getCheckInsForMonth, deleteCheckIn } from "./db";
import type { DailyCheckIn } from "../drizzle/schema";

export const appRouter = router({
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

  checkIn: router({
    today: protectedProcedure.query(async ({ ctx }) => {
      const today = new Date().toISOString().split('T')[0];
      return getDailyCheckIn(ctx.user.id, today);
    }),
    
    save: protectedProcedure
      .input((data: any) => data)
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split('T')[0];
        return createOrUpdateCheckIn(ctx.user.id, today, input);
      }),
    
    getByDate: protectedProcedure
      .input((data: any) => data)
      .query(async ({ ctx, input }) => {
        return getDailyCheckIn(ctx.user.id, input.date);
      }),
    
    weekSummary: protectedProcedure
      .input((data: any) => data)
      .query(async ({ ctx, input }) => {
        const entries = await getCheckInsForWeek(ctx.user.id, input.startDate, input.endDate);
        
        if (entries.length === 0) {
          return {
            entries: [],
            averages: null,
            strongestPillar: null,
            weakestPillar: null,
          };
        }
        
        const sum = entries.reduce(
          (acc: any, entry: DailyCheckIn) => ({
            mood: acc.mood + entry.moodScore,
            energy: acc.energy + entry.energyScore,
            stress: acc.stress + entry.stressScore,
            selfAwareness: acc.selfAwareness + entry.pillarSelfAwareness,
            mindset: acc.mindset + entry.pillarMindset,
            action: acc.action + entry.pillarAction,
            impact: acc.impact + entry.pillarImpact,
          }),
          { mood: 0, energy: 0, stress: 0, selfAwareness: 0, mindset: 0, action: 0, impact: 0 }
        );
        
        const count = entries.length;
        const averages = {
          mood: Math.round((sum.mood / count) * 10) / 10,
          energy: Math.round((sum.energy / count) * 10) / 10,
          stress: Math.round((sum.stress / count) * 10) / 10,
          selfAwareness: Math.round((sum.selfAwareness / count) * 10) / 10,
          mindset: Math.round((sum.mindset / count) * 10) / 10,
          action: Math.round((sum.action / count) * 10) / 10,
          impact: Math.round((sum.impact / count) * 10) / 10,
        };
        
        const pillars = [
          { name: 'Self-awareness', value: averages.selfAwareness },
          { name: 'Mindset', value: averages.mindset },
          { name: 'Action', value: averages.action },
          { name: 'Impact', value: averages.impact },
        ];
        
        const strongestPillar = pillars.reduce((a, b) => (a.value > b.value ? a : b));
        const weakestPillar = pillars.reduce((a, b) => (a.value < b.value ? a : b));
        
        return {
          entries,
          averages,
          strongestPillar,
          weakestPillar,
        };
      }),
    
    monthEntries: protectedProcedure
      .input((data: any) => data)
      .query(async ({ ctx, input }) => {
        return getCheckInsForMonth(ctx.user.id, input.year, input.month);
      }),
    
    delete: protectedProcedure
      .input((data: any) => data)
      .mutation(async ({ ctx, input }) => {
        await deleteCheckIn(ctx.user.id, input.date);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
