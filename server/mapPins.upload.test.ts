import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

// Mock storagePut so no real S3 calls happen
vi.mock("./storage", () => ({
  storagePut: vi.fn(async (key: string, _data: unknown, _ct: string) => ({
    key,
    url: `https://cdn.example.com/${key}`,
  })),
}));

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "owner-open-id",
    email: "owner@example.com",
    name: "Owner",
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

describe("mapPins.uploadPhoto", () => {
  it("accepts a valid data URL and returns a CDN url", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Minimal 1x1 red PNG as base64
    const pngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";
    const dataUrl = `data:image/png;base64,${pngBase64}`;

    const result = await caller.mapPins.uploadPhoto({
      dataUrl,
      filename: "test.png",
    });

    expect(result.url).toMatch(/^https:\/\/cdn\.example\.com\/map-pins\//);
    expect(result.url).toMatch(/\.png$/);
  });

  it("throws when the data URL is malformed", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.mapPins.uploadPhoto({ dataUrl: "not-a-data-url", filename: "bad.jpg" })
    ).rejects.toThrow("Invalid data URL");
  });
});
