import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getMapPins, createMapPin, updateMapPin, deleteMapPin, getMapRoutes, createMapRoute, updateMapRoute, deleteMapRoute, getDocuments, createDocument, deleteDocument, getDocumentById, getVendors, createVendor, updateVendor, deleteVendor, getVendorById, getWorkRecords, createWorkRecord, updateWorkRecord, deleteWorkRecord, importWorkRecords } from "./db";
import { storagePut } from "./storage";
import workRecordSeed from "./data/work-records-seed.json";

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

  documents: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        building: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return getDocuments(input.category, input.building);
      }),

    upload: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        category: z.string().default("other"),
        filename: z.string().min(1),
        dataUrl: z.string(), // base64 data URL
        building: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { dataUrl, filename, title, category, building, notes } = input;
        // Parse data URL
        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) throw new Error("Invalid data URL format");
        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");
        const fileSize = buffer.length;
        // Upload to S3
        const ext = filename.split(".").pop() ?? "bin";
        const key = `documents/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { url } = await storagePut(key, buffer, contentType);
        // Save metadata to DB
        const id = await createDocument({
          title,
          category,
          filename,
          fileKey: key,
          fileUrl: url,
          mimeType: contentType,
          fileSize,
          building: building ?? null,
          notes: notes ?? null,
        });
        return { id, url };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteDocument(input.id);
        return { success: true };
      }),
  }),

  vendors: router({
    list: publicProcedure
      .input(z.object({ trade: z.string().optional() }))
      .query(async ({ input }) => {
        return getVendors(input.trade);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        company: z.string().optional(),
        trade: z.string().default("other"),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        notes: z.string().optional(),
        building: z.string().optional(),
        license: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        lastUsed: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createVendor({
          ...input,
          company: input.company ?? null,
          phone: input.phone ?? null,
          email: input.email ?? null,
          website: input.website ?? null,
          notes: input.notes ?? null,
          building: input.building ?? null,
          license: input.license ?? null,
          rating: input.rating ?? null,
          lastUsed: input.lastUsed ?? null,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        company: z.string().optional(),
        trade: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
        notes: z.string().optional(),
        building: z.string().optional(),
        license: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        lastUsed: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateVendor(id, data as any);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteVendor(input.id);
        return { success: true };
      }),
  }),

  workRecords: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        location: z.string().optional(),
        needsReview: z.boolean().optional(),
      }))
      .query(async ({ input }) => {
        const records = await getWorkRecords(input);
        return records.map((record) => ({
          ...record,
          needsReview: Boolean(record.needsReview),
        }));
      }),

    create: protectedProcedure
      .input(z.object({
        sortDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        dateLabel: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.string().default("other"),
        location: z.string().default("Property-wide"),
        sourceImageUrl: z.string().optional(),
        sourceImageFilename: z.string().optional(),
        sourceText: z.string().optional(),
        needsReview: z.boolean().default(false),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createWorkRecord({
          ...input,
          sourceKey: `manual-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          description: input.description ?? null,
          sourceImageUrl: input.sourceImageUrl ?? null,
          sourceImageFilename: input.sourceImageFilename ?? null,
          sourceText: input.sourceText ?? null,
          needsReview: input.needsReview ? 1 : 0,
          notes: input.notes ?? null,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        sortDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        dateLabel: z.string().min(1).optional(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        location: z.string().optional(),
        sourceImageUrl: z.string().optional(),
        sourceImageFilename: z.string().optional(),
        sourceText: z.string().optional(),
        needsReview: z.boolean().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, needsReview, ...data } = input;
        await updateWorkRecord(id, {
          ...data,
          ...(needsReview !== undefined ? { needsReview: needsReview ? 1 : 0 } : {}),
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteWorkRecord(input.id);
        return { success: true };
      }),

    uploadSource: protectedProcedure
      .input(z.object({
        dataUrl: z.string(),
        filename: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const matches = input.dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        if (!matches) throw new Error("Source attachment must be an image data URL");
        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        if (buffer.length > 16 * 1024 * 1024) throw new Error("Source image exceeds the 16 MB limit");
        const ext = input.filename.split(".").pop() ?? "jpg";
        const key = `work-records/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { url } = await storagePut(key, buffer, contentType);
        return { url, filename: input.filename };
      }),

    importHistoricalSeed: protectedProcedure.mutation(async () => {
      const records = workRecordSeed.map((record) => ({
        ...record,
        needsReview: record.needsReview ? 1 : 0,
      }));
      return importWorkRecords(records);
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
