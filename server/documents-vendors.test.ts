import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock storagePut to avoid real S3 calls
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "documents/test-file.pdf", url: "/manus-storage/test-file.pdf" }),
}));

// Mock db functions
vi.mock("./db", () => ({
  getMapPins: vi.fn().mockResolvedValue([]),
  createMapPin: vi.fn().mockResolvedValue(1),
  updateMapPin: vi.fn().mockResolvedValue(undefined),
  deleteMapPin: vi.fn().mockResolvedValue(undefined),
  getMapRoutes: vi.fn().mockResolvedValue([]),
  createMapRoute: vi.fn().mockResolvedValue(1),
  updateMapRoute: vi.fn().mockResolvedValue(undefined),
  deleteMapRoute: vi.fn().mockResolvedValue(undefined),
  getDocuments: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Beach House Insurance",
      category: "insurance",
      filename: "insurance-2025.pdf",
      fileKey: "documents/insurance-2025.pdf",
      fileUrl: "/manus-storage/insurance-2025.pdf",
      mimeType: "application/pdf",
      fileSize: 245000,
      building: "Beach House",
      notes: "Annual policy",
      createdAt: new Date("2025-01-15"),
    },
  ]),
  createDocument: vi.fn().mockResolvedValue(2),
  deleteDocument: vi.fn().mockResolvedValue(undefined),
  getDocumentById: vi.fn().mockResolvedValue(null),
  getVendors: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "John Smith",
      company: "Island Plumbing",
      trade: "plumbing",
      phone: "(360) 555-1234",
      email: "john@island.com",
      website: "https://islandplumbing.com",
      notes: "Reliable, good rates",
      building: "Main House",
      license: "PLM-12345",
      rating: 4,
      lastUsed: null,
      createdAt: new Date("2025-03-01"),
      updatedAt: new Date("2025-03-01"),
    },
  ]),
  createVendor: vi.fn().mockResolvedValue(2),
  updateVendor: vi.fn().mockResolvedValue(undefined),
  deleteVendor: vi.fn().mockResolvedValue(undefined),
  getVendorById: vi.fn().mockResolvedValue(null),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-owner",
    email: "owner@example.com",
    name: "Test Owner",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("documents", () => {
  it("lists documents without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.documents.list({});
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Beach House Insurance");
    expect(result[0].category).toBe("insurance");
  });

  it("lists documents with category filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.documents.list({ category: "insurance" });
    expect(result).toBeDefined();
  });

  it("lists documents with building filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.documents.list({ building: "Beach House" });
    expect(result).toBeDefined();
  });

  it("uploads a document when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    // Create a small base64 PDF-like data URL
    const fakeDataUrl = "data:application/pdf;base64,JVBERi0xLjQK";
    const result = await caller.documents.upload({
      title: "Test Document",
      category: "permit",
      filename: "test.pdf",
      dataUrl: fakeDataUrl,
      building: "Main House",
      notes: "Test upload",
    });
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("url");
    expect(result.id).toBe(2);
  });

  it("rejects upload with invalid data URL", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.documents.upload({
        title: "Bad Doc",
        category: "other",
        filename: "bad.pdf",
        dataUrl: "not-a-valid-data-url",
      })
    ).rejects.toThrow();
  });

  it("deletes a document when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.documents.delete({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("rejects upload without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.documents.upload({
        title: "Unauthorized",
        category: "other",
        filename: "hack.pdf",
        dataUrl: "data:application/pdf;base64,JVBERi0xLjQK",
      })
    ).rejects.toThrow();
  });
});

describe("vendors", () => {
  it("lists vendors without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.vendors.list({});
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("John Smith");
    expect(result[0].trade).toBe("plumbing");
  });

  it("lists vendors with trade filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.vendors.list({ trade: "plumbing" });
    expect(result).toBeDefined();
  });

  it("creates a vendor when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.vendors.create({
      name: "Jane Doe",
      company: "Doe Electric",
      trade: "electrical",
      phone: "(360) 555-5678",
      email: "jane@doe-electric.com",
      rating: 5,
    });
    expect(result).toHaveProperty("id");
    expect(result.id).toBe(2);
  });

  it("updates a vendor when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.vendors.update({
      id: 1,
      phone: "(360) 555-9999",
      rating: 5,
    });
    expect(result).toEqual({ success: true });
  });

  it("deletes a vendor when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.vendors.delete({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("rejects create without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.vendors.create({
        name: "Unauthorized Vendor",
        trade: "other",
      })
    ).rejects.toThrow();
  });

  it("rejects delete without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.vendors.delete({ id: 1 })).rejects.toThrow();
  });
});
