import { describe, expect, it } from "vitest";
import { mapPinPreviewText } from "../client/src/pages/mapPinPreview";

describe("map-pin quick preview notes", () => {
  it("shows plain, readable task or site notes without formatting or extra whitespace", () => {
    expect(mapPinPreviewText("**Inspect:**  Main panel\n[Work order](https://example.com/order)"))
      .toBe("Inspect: Main panel Work order");
  });

  it("handles a photo-only pin with no notes", () => {
    expect(mapPinPreviewText(null)).toBeNull();
    expect(mapPinPreviewText(" \n ")).toBeNull();
  });

  it("limits long notes to a quick preview while leaving the full pin data untouched", () => {
    const note = "A".repeat(130);
    expect(mapPinPreviewText(note)).toBe(`${"A".repeat(119)}…`);
    expect(mapPinPreviewText(note, 12)).toBe(`${"A".repeat(11)}…`);
    expect(note).toHaveLength(130);
  });
});
