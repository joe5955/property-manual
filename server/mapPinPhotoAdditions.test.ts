import { describe, expect, it } from "vitest";
import manifest from "./data/map-pin-photo-additions.json";
import {
  appendMapPinNote,
  appendUniqueMapPinPhotos,
  detachMapPinNote,
  detachMapPinPhotos,
} from "./mapPinPhotoAdditions";

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

  describe("detachMapPinPhotos", () => {
    it("removes only the moved URLs while preserving original and unrelated photo order without mutating inputs", () => {
      const originalPhoto = "https://example.test/original-pump-house.jpg";
      const firstMovedPhoto = "/manus-storage/pump-house-west-labeled-lines.jpg";
      const unrelatedPhoto = "/manus-storage/other-water-feature.jpg";
      const secondMovedPhoto = "/manus-storage/pump-house-west-tank-connection.jpg";
      const existing = [originalPhoto, firstMovedPhoto, unrelatedPhoto, secondMovedPhoto, originalPhoto];
      const moved = [firstMovedPhoto, secondMovedPhoto];
      const existingBefore = [...existing];
      const movedBefore = [...moved];

      const detached = detachMapPinPhotos(existing, moved);

      expect(detached).toEqual([originalPhoto, unrelatedPhoto, originalPhoto]);
      expect(detachMapPinPhotos(detached, moved)).toEqual(detached);
      expect(existing).toEqual(existingBefore);
      expect(moved).toEqual(movedBefore);
    });
  });

  describe("detachMapPinNote", () => {
    it("removes only the exact moved-note paragraph and preserves unrelated paragraphs", () => {
      const before = "Original pump house note.";
      const movedNote = "Piping on the west side of the Pump House (owner-confirmed).";
      const similarButUnrelated = "Piping on the west side of the Pump House (owner-confirmed). Verify on site.";
      const after = "Keep this unrelated utility warning.";
      const existing = [before, movedNote, similarButUnrelated, after].join("\n\n");

      const detached = detachMapPinNote(existing, movedNote);

      expect(detached).toBe([before, similarButUnrelated, after].join("\n\n"));
      expect(detachMapPinNote(detached, movedNote)).toBe(detached);
    });

    it("preserves a null note", () => {
      expect(detachMapPinNote(null, "Piping on the west side of the Pump House (owner-confirmed).")).toBeNull();
    });
  });

  describe("Pump House Pipes — West Side manifest", () => {
    it("creates the owner-confirmed water pin at the X on A5 without moving or replacing its existing photos", () => {
      expect(manifest).toHaveLength(1);
      expect(manifest[0]).toMatchObject({
        pinId: 210002,
        sheetId: 5,
        category: "water",
        title: "Pump House Pipes — West Side",
        positionX: 83.64,
        positionY: 82.82,
        createIfMissing: true,
        preserveExistingPhotos: true,
        preservePosition: true,
      });
      expect(manifest[0].provenance).toContain("X on A-5.0");
      expect(manifest[0].provenance).toContain("x 83.64%, y 82.82%");
    });

    it("preserves the prior A7 pin identity and original photo while relocating only the two new photos and exact added note", () => {
      const addition = manifest[0];

      expect(addition.previousAssignment).toMatchObject({
        pinId: 120003,
        sheetId: 7,
        originalTitle: "pump house pipes",
        renamedTitle: "Pump House Pipes — West Side",
        preserveOriginalPhoto: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5Wh7ynUieoKvKRb4ttPNaL/map-pins/1772662041783-yfm9bvcsmtf.JPEG",
        preservePosition: true,
        addedNote:
          "Piping on the west side of the Pump House (owner-confirmed). Two annotated reference photos provided October 28, 2026: labeled tank/well/pond pipe runs and additional tank connections. Annotations are preserved as supplied; confirm utility locations on site before excavation.",
      });
      expect(addition.photos).toHaveLength(2);
      expect(addition.previousAssignment.addedNote).not.toBe(addition.notesToAppend);
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
