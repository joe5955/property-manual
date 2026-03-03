import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getMapPins, createMapPin, updateMapPin, deleteMapPin } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  mapPins: router({
    list: publicProcedure
      .input(z.object({ sheetId: z.number().optional() }))
      .query(async ({ input }) => {
        const pins = await getMapPins(input.sheetId);
        return pins.map(p => ({
          ...p,
          photos: p.photos ? JSON.parse(p.photos as string) as string[] : [],
        }));
      }),

    create: protectedProcedure
      .input(z.object({
        sheetId: z.number().default(1),
        title: z.string().min(1),
        notes: z.string().optional(),
        category: z.string().default("other"),
        positionX: z.number(),
        positionY: z.number(),
        photos: z.array(z.string()).default([]),
        manualSectionId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createMapPin({
          ...input,
          photos: JSON.stringify(input.photos),
          notes: input.notes ?? null,
          manualSectionId: input.manualSectionId ?? null,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        notes: z.string().optional(),
        category: z.string().optional(),
        positionX: z.number().optional(),
        positionY: z.number().optional(),
        photos: z.array(z.string()).optional(),
        manualSectionId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, photos, ...rest } = input;
        await updateMapPin(id, {
          ...rest,
          ...(photos !== undefined ? { photos: JSON.stringify(photos) } : {}),
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteMapPin(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
