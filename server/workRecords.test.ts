import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getWorkRecords: vi.fn(),
  createWorkRecord: vi.fn(),
  updateWorkRecord: vi.fn(),
  deleteWorkRecord: vi.fn(),
  importWorkRecords: vi.fn(),
  storagePut: vi.fn(),
}));

vi.mock("./db", () => ({
  getMapPins: vi.fn().mockResolvedValue([]),
  createMapPin: vi.fn(),
  updateMapPin: vi.fn(),
  deleteMapPin: vi.fn(),
  getMapRoutes: vi.fn().mockResolvedValue([]),
  createMapRoute: vi.fn(),
  updateMapRoute: vi.fn(),
  deleteMapRoute: vi.fn(),
  getDocuments: vi.fn().mockResolvedValue([]),
  createDocument: vi.fn(),
  deleteDocument: vi.fn(),
  getDocumentById: vi.fn(),
  getVendors: vi.fn().mockResolvedValue([]),
  createVendor: vi.fn(),
  updateVendor: vi.fn(),
  deleteVendor: vi.fn(),
  getVendorById: vi.fn(),
  getWorkRecords: mocks.getWorkRecords,
  createWorkRecord: mocks.createWorkRecord,
  updateWorkRecord: mocks.updateWorkRecord,
  deleteWorkRecord: mocks.deleteWorkRecord,
  importWorkRecords: mocks.importWorkRecords,
}));

vi.mock("./storage", () => ({ storagePut: mocks.storagePut }));

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(authenticated: boolean): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "work-history-owner",
    email: "owner@example.com",
    name: "Owner",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user: authenticated ? user : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getWorkRecords.mockResolvedValue([
    {
      id: 1,
      sourceKey: "handwritten-test",
      sortDate: "2020-08-01",
      dateLabel: "August 2020",
      title: "Replaced Pump House roof",
      description: "The Pump House roof was replaced.",
      category: "construction",
      location: "Pump House",
      sourceImageUrl: "/manus-storage/source.jpg",
      sourceImageFilename: "source.jpg",
      sourceText: "August 2020 — Replace Roof Pump House",
      needsReview: 0,
      notes: "Partial historical record.",
      createdAt: new Date("2026-09-29"),
      updatedAt: new Date("2026-09-29"),
    },
  ]);
  mocks.createWorkRecord.mockResolvedValue(2);
  mocks.updateWorkRecord.mockResolvedValue(undefined);
  mocks.deleteWorkRecord.mockResolvedValue(undefined);
  mocks.importWorkRecords.mockResolvedValue({ inserted: 50, existing: 0 });
  mocks.storagePut.mockResolvedValue({ key: "work-records/source.jpg", url: "/manus-storage/source.jpg" });
});

describe("workRecords", () => {
  it("lists the chronological work archive publicly", async () => {
    const caller = appRouter.createCaller(createContext(false));
    const result = await caller.workRecords.list({});
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: "Replaced Pump House roof",
      needsReview: false,
    });
  });

  it("passes category, location, and review filters to the database", async () => {
    const caller = appRouter.createCaller(createContext(false));
    await caller.workRecords.list({ category: "repair", location: "Main House", needsReview: true });
    expect(mocks.getWorkRecords).toHaveBeenCalledWith({ category: "repair", location: "Main House", needsReview: true });
  });

  it("creates a work record for an authenticated owner", async () => {
    const caller = appRouter.createCaller(createContext(true));
    const result = await caller.workRecords.create({
      sortDate: "2024-03-01",
      dateLabel: "March 2024",
      title: "New fire station",
      category: "fire-safety",
      location: "Main House",
      needsReview: false,
    });
    expect(result).toEqual({ id: 2 });
    expect(mocks.createWorkRecord).toHaveBeenCalledWith(expect.objectContaining({
      sortDate: "2024-03-01",
      title: "New fire station",
      needsReview: 0,
      sourceKey: expect.stringMatching(/^manual-/),
    }));
  });

  it("updates and deletes work records for an authenticated owner", async () => {
    const caller = appRouter.createCaller(createContext(true));
    await expect(caller.workRecords.update({ id: 1, needsReview: false, location: "Main House" })).resolves.toEqual({ success: true });
    expect(mocks.updateWorkRecord).toHaveBeenCalledWith(1, { needsReview: 0, location: "Main House" });
    await expect(caller.workRecords.delete({ id: 1 })).resolves.toEqual({ success: true });
    expect(mocks.deleteWorkRecord).toHaveBeenCalledWith(1);
  });

  it("rejects edits from an unauthenticated visitor", async () => {
    const caller = appRouter.createCaller(createContext(false));
    await expect(caller.workRecords.create({
      sortDate: "2024-01-01",
      dateLabel: "2024",
      title: "Unauthorized record",
      category: "other",
      location: "Property-wide",
      needsReview: false,
    })).rejects.toThrow();
    await expect(caller.workRecords.delete({ id: 1 })).rejects.toThrow();
  });

  it("uploads a source-note image for an authenticated owner", async () => {
    const caller = appRouter.createCaller(createContext(true));
    const result = await caller.workRecords.uploadSource({
      filename: "note.jpg",
      dataUrl: "data:image/jpeg;base64,/9j/4AAQ",
    });
    expect(result).toEqual({ url: "/manus-storage/source.jpg", filename: "note.jpg" });
    expect(mocks.storagePut).toHaveBeenCalledOnce();
  });

  it("rejects non-image source attachments", async () => {
    const caller = appRouter.createCaller(createContext(true));
    await expect(caller.workRecords.uploadSource({
      filename: "note.txt",
      dataUrl: "data:text/plain;base64,SGVsbG8=",
    })).rejects.toThrow("Source attachment must be an image data URL");
  });

  it("imports the Git-tracked historical seed through a protected idempotent procedure", async () => {
    const caller = appRouter.createCaller(createContext(true));
    const result = await caller.workRecords.importHistoricalSeed();
    expect(result).toEqual({ inserted: 50, existing: 0 });
    expect(mocks.importWorkRecords).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ sourceKey: "handwritten-2026-09-29-p09-r05", title: "Replaced Pump House roof", needsReview: 0 }),
    ]));
    expect(mocks.importWorkRecords.mock.calls[0][0]).toHaveLength(50);
  });
});
