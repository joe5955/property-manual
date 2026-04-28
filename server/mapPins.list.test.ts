import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  getMapPins: vi.fn(),
}));

vi.mock("./db", () => ({
  getMapPins: mocks.getMapPins,
  createMapPin: vi.fn().mockResolvedValue(1),
  updateMapPin: vi.fn().mockResolvedValue(undefined),
  deleteMapPin: vi.fn().mockResolvedValue(undefined),
  getMapRoutes: vi.fn().mockResolvedValue([]),
  createMapRoute: vi.fn().mockResolvedValue(1),
  updateMapRoute: vi.fn().mockResolvedValue(undefined),
  deleteMapRoute: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "map-pins/test.jpg", url: "https://cdn.example.com/map-pins/test.jpg" }),
}));

import { appRouter } from "./routers";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("mapPins.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getMapPins.mockResolvedValue([
      {
        id: 60001,
        sheetId: 5,
        title: "100k Water Tank Valves",
        notes: "Valve manifold reference point",
        category: "water",
        positionX: 84.5,
        positionY: 28.42,
        photos: JSON.stringify(["https://cdn.example.com/valve-1.jpg"]),
        manualSectionId: null,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
      },
      {
        id: 90001,
        sheetId: 1,
        title: "Fiber Optic — Property Entrance Splice Point",
        notes: null,
        category: "electrical",
        positionX: 15,
        positionY: 85,
        photos: null,
        manualSectionId: null,
        createdAt: new Date("2026-01-02T00:00:00Z"),
        updatedAt: new Date("2026-01-02T00:00:00Z"),
      },
    ]);
  });

  it("is publicly readable and returns parsed photo arrays for saved pins", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const pins = await caller.mapPins.list({});

    expect(mocks.getMapPins).toHaveBeenCalledWith(undefined);
    expect(pins).toHaveLength(2);
    expect(pins[0]).toMatchObject({
      id: 60001,
      sheetId: 5,
      title: "100k Water Tank Valves",
      category: "water",
      positionX: 84.5,
      positionY: 28.42,
      photos: ["https://cdn.example.com/valve-1.jpg"],
    });
    expect(pins[1].photos).toEqual([]);
  });

  it("passes the sheet filter to the database helper", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await caller.mapPins.list({ sheetId: 5 });

    expect(mocks.getMapPins).toHaveBeenCalledWith(5);
  });
});
