import { describe, expect, it } from "vitest";
import corrections from "./data/map-pin-location-corrections.json";

describe("owner-approved site-plan pin corrections", () => {
  it("contains one unambiguous correction for the offshore Main House fiber endpoint", () => {
    expect(corrections).toHaveLength(1);
    expect(corrections[0]).toMatchObject({
      pinId: 90002,
      sheetId: 1,
      title: "Fiber Optic — Main House Termination",
      category: "electrical",
      previousPosition: { x: 78, y: 18 },
      position: { x: 59.5, y: 47 },
    });
    expect(corrections[0].reason).toContain("south of the Main House");
  });

  it("keeps every saved target position on a map sheet and does not reuse an ID", () => {
    expect(new Set(corrections.map(c => c.pinId)).size).toBe(corrections.length);
    for (const correction of corrections) {
      expect(correction.sheetId).toBeGreaterThanOrEqual(1);
      expect(correction.sheetId).toBeLessThanOrEqual(7);
      for (const coordinate of [correction.position.x, correction.position.y]) {
        expect(coordinate).toBeGreaterThanOrEqual(0);
        expect(coordinate).toBeLessThanOrEqual(100);
      }
    }
  });
});
