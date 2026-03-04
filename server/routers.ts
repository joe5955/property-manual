import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getMapPins, createMapPin, updateMapPin, deleteMapPin, getMapRoutes, createMapRoute, updateMapRoute, deleteMapRoute } from "./db";
import { storagePut } from "./storage";

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

    uploadPhoto: protectedProcedure
      .input(z.object({
        // base64-encoded file content
        dataUrl: z.string(),
        // original filename for extension detection
        filename: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { dataUrl, filename } = input;
        // dataUrl is like: data:image/jpeg;base64,/9j/4AAQ...
        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) throw new Error("Invalid data URL");
        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");
        // Generate a unique key
        const ext = filename.split(".").pop() ?? "jpg";
        const key = `map-pins/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { url } = await storagePut(key, buffer, contentType);
        return { url };
      }),
  }),

  mapRoutes: router({
    list: publicProcedure
      .input(z.object({ sheetId: z.number().optional() }))
      .query(async ({ input }) => {
        const routes = await getMapRoutes(input.sheetId);
        return routes.map(r => ({
          ...r,
          points: r.points ? JSON.parse(r.points as string) as Array<{ x: number; y: number }> : [],
          photos: r.photos ? JSON.parse(r.photos as string) as string[] : [],
        }));
      }),

    create: protectedProcedure
      .input(z.object({
        sheetId: z.number().default(1),
        title: z.string().min(1),
        notes: z.string().optional(),
        category: z.string().default("other"),
        color: z.string().default("#f97316"),
        points: z.array(z.object({ x: z.number(), y: z.number() })).default([]),
        photos: z.array(z.string()).default([]),
        manualSectionId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createMapRoute({
          ...input,
          points: JSON.stringify(input.points),
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
        color: z.string().optional(),
        points: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
        photos: z.array(z.string()).optional(),
        manualSectionId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, points, photos, ...rest } = input;
        await updateMapRoute(id, {
          ...rest,
          ...(points !== undefined ? { points: JSON.stringify(points) } : {}),
          ...(photos !== undefined ? { photos: JSON.stringify(photos) } : {}),
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteMapRoute(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

