import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getPropertyTasks: vi.fn(), getTaskTimeEntries: vi.fn(), getPropertyTask: vi.fn(),
  createPropertyTask: vi.fn(), updatePropertyTask: vi.fn(),
  createTaskTimeEntry: vi.fn(), deleteTaskTimeEntry: vi.fn(),
}));
vi.mock("./db", () => mocks);
import { propertyTasksRouter } from "./routers/propertyTasks";

type User = NonNullable<TrpcContext["user"]>;
function context(role?: "admin" | "user"): TrpcContext {
  const user: User = {
    id: 1, openId: "task-owner", email: "owner@example.com", name: "Owner",
    loginMethod: "manus", role: role ?? "user", createdAt: new Date(),
    updatedAt: new Date(), lastSignedIn: new Date(),
  };
  return {
    user: role ? user : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getPropertyTasks.mockResolvedValue([]);
  mocks.getTaskTimeEntries.mockResolvedValue([]);
  mocks.getPropertyTask.mockResolvedValue({ id: 12, status: "in_progress", completedAt: null });
  mocks.createPropertyTask.mockResolvedValue(12);
  mocks.createTaskTimeEntry.mockResolvedValue(4);
  mocks.updatePropertyTask.mockResolvedValue(undefined);
  mocks.deleteTaskTimeEntry.mockResolvedValue(undefined);
});

describe("private property task ledger", () => {
  it("does not expose tasks or source notes to anonymous visitors or non-admin accounts", async () => {
    for (const role of [undefined, "user"] as const) {
      const caller = propertyTasksRouter.createCaller(context(role));
      await expect(caller.list()).rejects.toThrow();
      await expect(caller.create({ title: "Well work", location: "Pump House" })).rejects.toThrow();
      await expect(caller.addTime({ taskId: 12, workedAt: Date.now(), minutes: 45 })).rejects.toThrow();
      await expect(caller.update({ id: 12, status: "done" })).rejects.toThrow();
    }
  });

  it("allows the owner to read both tasks and explicit time entries", async () => {
    mocks.getPropertyTasks.mockResolvedValue([{ id: 12, title: "Pump filter", sourceNote: "Fieldy note 10/02" }]);
    mocks.getTaskTimeEntries.mockResolvedValue([{ id: 4, taskId: 12, minutes: 45 }]);
    const result = await propertyTasksRouter.createCaller(context("admin")).list();
    expect(result.tasks[0].title).toBe("Pump filter");
    expect(result.timeEntries[0].minutes).toBe(45);
  });

  it("creates a to-do task without inferring time or completion from a field note", async () => {
    const result = await propertyTasksRouter.createCaller(context("admin")).create({
      title: " Check Pump House filter ", location: "Pump House", sourceNote: "Fieldy Oct 2 walk",
      suggestions: "Inspect pressure",
    });
    expect(result).toEqual({ id: 12 });
    expect(mocks.createPropertyTask).toHaveBeenCalledWith(expect.objectContaining({
      title: "Check Pump House filter", status: "todo", completedAt: null,
      suggestions: "Inspect pressure", sourceNote: "Fieldy Oct 2 walk",
    }));
    expect(mocks.createTaskTimeEntry).not.toHaveBeenCalled();
  });

  it("sets completion only on explicit status change and clears it on reopen", async () => {
    const caller = propertyTasksRouter.createCaller(context("admin"));
    const before = Date.now();
    await caller.update({ id: 12, status: "done" });
    const change = mocks.updatePropertyTask.mock.calls[0][1];
    expect(change.status).toBe("done");
    expect(change.completedAt).toBeGreaterThanOrEqual(before);
    expect(change.completedAt).toBeLessThanOrEqual(Date.now());
    await caller.update({ id: 12, status: "in_progress" });
    expect(mocks.updatePropertyTask).toHaveBeenLastCalledWith(12, { status: "in_progress", completedAt: null });
  });

  it("preserves the original completion time on an edit and rejects missing tasks", async () => {
    const caller = propertyTasksRouter.createCaller(context("admin"));
    mocks.getPropertyTask.mockResolvedValueOnce({ id: 12, status: "done", completedAt: 123456789 });
    await caller.update({ id: 12, status: "done", title: "Revised title" });
    expect(mocks.updatePropertyTask).toHaveBeenCalledWith(12, { status: "done", title: "Revised title", completedAt: 123456789 });
    mocks.getPropertyTask.mockResolvedValueOnce(undefined);
    await expect(caller.update({ id: 999, title: "Not there" })).rejects.toThrow("Property task not found");
  });

  it("records only owner-provided labor minutes, never the Fieldy recording duration", async () => {
    const caller = propertyTasksRouter.createCaller(context("admin"));
    const workedAt = new Date("2026-10-02T12:00:00Z").getTime();
    expect(await caller.addTime({ taskId: 12, workedAt, minutes: 45, note: "Filter replacement" })).toEqual({ id: 4 });
    expect(mocks.createTaskTimeEntry).toHaveBeenCalledWith({ taskId: 12, workedAt, minutes: 45, note: "Filter replacement" });
    await expect(caller.addTime({ taskId: 12, workedAt, minutes: 0 })).rejects.toThrow();
    await expect(caller.addTime({ taskId: 12, workedAt: Date.now() + 48 * 3600000, minutes: 12 })).rejects.toThrow();
    mocks.getPropertyTask.mockResolvedValueOnce(undefined);
    await expect(caller.addTime({ taskId: 999, workedAt, minutes: 12 })).rejects.toThrow("Property task not found");
    expect(mocks.createTaskTimeEntry).toHaveBeenCalledTimes(1);
  });
});
