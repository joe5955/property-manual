import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  createPropertyTask,
  createTaskTimeEntry,
  deleteTaskTimeEntry,
  getPropertyTask,
  getPropertyTasks,
  getTaskTimeEntries,
  updatePropertyTask,
} from "../db";

const taskFields = z.object({
  title: z.string().trim().min(1).max(255),
  location: z.string().trim().min(1).max(160),
  description: z.string().trim().max(3000).optional(),
  suggestions: z.string().trim().max(2000).optional(),
  sourceNote: z.string().trim().max(500).optional(),
});
const status = z.enum(["todo", "in_progress", "done"]);

export const propertyTasksRouter = router({
  list: adminProcedure.query(async () => {
    const [tasks, timeEntries] = await Promise.all([getPropertyTasks(), getTaskTimeEntries()]);
    return { tasks, timeEntries };
  }),

  create: adminProcedure.input(taskFields).mutation(async ({ input }) => {
    const id = await createPropertyTask({
      title: input.title,
      location: input.location,
      description: input.description || null,
      suggestions: input.suggestions || null,
      sourceNote: input.sourceNote || null,
      status: "todo",
      completedAt: null,
    });
    return { id };
  }),

  update: adminProcedure.input(taskFields.partial().extend({ id: z.number().int().positive(), status: status.optional() }))
    .mutation(async ({ input }) => {
      const existing = await getPropertyTask(input.id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Property task not found" });
      const { id, status: nextStatus, ...fields } = input;
      await updatePropertyTask(id, {
        ...fields,
        ...(nextStatus === undefined ? {} : {
          status: nextStatus,
          completedAt: nextStatus === "done" ? (existing.completedAt ?? Date.now()) : null,
        }),
      });
      return { success: true };
    }),

  addTime: adminProcedure.input(z.object({
    taskId: z.number().int().positive(),
    workedAt: z.number().int().nonnegative(),
    minutes: z.number().int().min(1).max(1440),
    note: z.string().trim().max(500).optional(),
  })).mutation(async ({ input }) => {
    const task = await getPropertyTask(input.taskId);
    if (!task) throw new TRPCError({ code: "NOT_FOUND", message: "Property task not found" });
    if (input.workedAt > Date.now() + 24 * 60 * 60 * 1000) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Work date cannot be in the future" });
    }
    const id = await createTaskTimeEntry({
      taskId: input.taskId,
      workedAt: input.workedAt,
      minutes: input.minutes,
      note: input.note || null,
    });
    return { id };
  }),

  deleteTime: adminProcedure.input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteTaskTimeEntry(input.id);
      return { success: true };
    }),
});
