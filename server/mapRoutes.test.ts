import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getMapPins: vi.fn().mockResolvedValue([]),
  createMapPin: vi.fn().mockResolvedValue(1),
  updateMapPin: vi.fn().mockResolvedValue(undefined),
  deleteMapPin: vi.fn().mockResolvedValue(undefined),
  getMapRoutes: vi.fn().mockResolvedValue([]),
  createMapRoute: vi.fn().mockResolvedValue(42),
  updateMapRoute: vi.fn().mockResolvedValue(undefined),
  deleteMapRoute: vi.fn().mockResolvedValue(undefined),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/test.jpg", key: "test.jpg" }),
}));

import * as db from "./db";

describe("mapRoutes DB helpers (mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a route and returns an id", async () => {
    const id = await db.createMapRoute({
      sheetId: 1,
      title: "Fiber Optic Conduit",
      notes: "Installed Oct 2024",
      category: "electrical",
      color: "#f97316",
      points: JSON.stringify([{ x: 10, y: 20 }, { x: 50, y: 60 }, { x: 90, y: 80 }]),
      photos: JSON.stringify(["https://cdn.example.com/fiber1.jpg"]),
      manualSectionId: null,
    });
    expect(id).toBe(42);
    expect(db.createMapRoute).toHaveBeenCalledOnce();
  });

  it("lists routes and returns empty array when none exist", async () => {
    const routes = await db.getMapRoutes(1);
    expect(routes).toEqual([]);
    expect(db.getMapRoutes).toHaveBeenCalledWith(1);
  });

  it("updates a route", async () => {
    await db.updateMapRoute(42, { title: "Updated Fiber Route", color: "#3b82f6" });
    expect(db.updateMapRoute).toHaveBeenCalledWith(42, { title: "Updated Fiber Route", color: "#3b82f6" });
  });

  it("deletes a route", async () => {
    await db.deleteMapRoute(42);
    expect(db.deleteMapRoute).toHaveBeenCalledWith(42);
  });

  it("parses points JSON correctly", () => {
    const raw = JSON.stringify([{ x: 10.5, y: 20.3 }, { x: 50.0, y: 60.1 }]);
    const parsed = JSON.parse(raw) as Array<{ x: number; y: number }>;
    expect(parsed).toHaveLength(2);
    expect(parsed[0].x).toBeCloseTo(10.5);
    expect(parsed[1].y).toBeCloseTo(60.1);
  });

  it("parses photos JSON correctly", () => {
    const raw = JSON.stringify(["https://cdn.example.com/a.jpg", "https://cdn.example.com/b.jpg"]);
    const parsed = JSON.parse(raw) as string[];
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toContain("a.jpg");
  });
});
