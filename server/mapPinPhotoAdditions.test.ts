import { describe, expect, it } from "vitest";
import manifest from "./data/map-pin-photo-additions.json";
import { appendMapPinNote, appendUniqueMapPinPhotos } from "./mapPinPhotoAdditions";

describe("map-pin owner photo additions", () => {
  describe("appendUniqueMapPinPhotos", () => {
    it("preserves existing order and duplicates while appending each new photo once", () => {
      const existing = ["/existing-a.jpg", "/existing-a.jpg", "/existing-b.jpg"];
      const additions = ["/new-west-side.jpg", "/existing-a.jpg", "/new-west-side.jpg", "/new-tank.jpg"];

      expect(appendUniqueMapPinPhotos(existing, additions)).toEqual([
        "/existing-a.jpg",
        "/existing-a.jpg",
        "/existing-b.jpg",
        "/new-west-side.jpg",
        "/new-tank.jpg",
      ]);
    });

    it("is idempotent when the same owner photo addition is rerun", () => {
      const existing = ["/existing.jpg"];
      const additions = ["/west-side.jpg", "/tank-connection.jpg"];
      const once = appendUniqueMapPinPhotos(existing, additions);

      expect(appendUniqueMapPinPhotos(once, additions)).toEqual(once);
    });

    it("does not mutate either input", () => {
      const existing = ["/existing.jpg", "/existing.jpg"];
      const additions = ["/west-side.jpg", "/west-side.jpg"];
      const existingBefore = [...existing];
      const additionsBefore = [...additions];

      appendUniqueMapPinPhotos(existing, additions);

      expect(existing).toEqual(existingBefore);
      expect(additions).toEqual(additionsBefore);
    });
  });

  describe("appendMapPinNote", () => {
    it("preserves existing text and appends a new note once", () => {
      const existing = "Original site note.\nKeep this text exactly.";
      const addition = "Owner-confirmed west-side photo reference.";
      const appended = appendMapPinNote(existing, addition);

      expect(appended).toBe(`${existing}\n\n${addition}`);
      expect(appendMapPinNote(appended, addition)).toBe(appended);
    });

    it("handles a null existing note", () => {
      expect(appendMapPinNote(null, "Owner-confirmed west-side photo reference.")).toBe(
        "Owner-confirmed west-side photo reference.",
      );
    });
  });

  describe("Pump House Pipes — West Side manifest", () => {
    it("targets the owner-confirmed water pin without moving it or replacing existing photos", () => {
      expect(manifest).toHaveLength(1);
      expect(manifest[0]).toMatchObject({
        pinId: 120003,
        sheetId: 7,
        category: "water",
        title: "Pump House Pipes — West Side",
        preserveExistingPhotos: true,
        preservePosition: true,
      });
      expect(manifest[0].provenance).toContain("Owner confirmed location: pump house pipes west side");
    });

    it("contains two distinct, valid owner-uploaded west-side photo records", () => {
      const addition = manifest[0];
      const photos = addition.photos;

      expect(photos).toHaveLength(2);
      expect(new Set(photos.map(photo => photo.url)).size).toBe(2);
      expect(new Set(photos.map(photo => photo.sha256)).size).toBe(2);

      for (const photo of photos) {
        expect(photo.url).toMatch(/^\/manus-storage\/.+$/);
        expect(photo.fileSize).toBeGreaterThan(0);
        expect(photo.width).toBeGreaterThan(photo.height);
        expect(photo.sha256).toMatch(/^[a-f0-9]{64}$/);
        expect(photo.sourceSha256).toMatch(/^[a-f0-9]{64}$/);
      }
    });
  });
});
