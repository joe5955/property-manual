import { describe, expect, it } from "vitest";
import records from "./data/work-records-seed.json";

describe("historical work-record seed", () => {
  it("preserves all 50 transcribed entries from nine photographed pages", () => {
    expect(records).toHaveLength(50);
    expect(new Set(records.map((record) => record.sourceImageFilename)).size).toBe(9);
    expect(records.filter((record) => record.needsReview)).toHaveLength(18);
  });

  it("uses unique stable source keys and complete chronological metadata", () => {
    const keys = records.map((record) => record.sourceKey);
    expect(new Set(keys).size).toBe(keys.length);

    for (const record of records) {
      expect(record.sourceKey).toMatch(/^handwritten-2026-09-29-p\d{2}-r\d{2}$/);
      expect(record.sortDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.dateLabel.trim()).not.toBe("");
      expect(record.title.trim()).not.toBe("");
      expect(record.category.trim()).not.toBe("");
      expect(record.location.trim()).not.toBe("");
      expect(record.sourceImageUrl).toMatch(/^\/manus-storage\//);
      expect(record.sourceText.trim()).not.toBe("");
    }
  });

  it("covers the supplied date range and critical property improvements", () => {
    const dates = records.map((record) => record.sortDate).sort();
    expect(dates[0]).toBe("1999-05-01");
    expect(dates.at(-1)).toBe("2025-02-01");
    expect(records).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: "Addition to Madrona House", sortDate: "2017-01-01" }),
      expect.objectContaining({ title: "Installed fiber internet", sortDate: "2020-10-01" }),
      expect.objectContaining({ title: "Replaced Pump House roof", sortDate: "2020-08-01" }),
      expect.objectContaining({ title: "New fire-suppression work", sortDate: "2025-02-01" }),
    ]));
  });
});
