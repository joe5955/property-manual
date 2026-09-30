import { describe, expect, it } from "vitest";
import { groupWorkRecordsByLocation } from "../client/src/pages/workHistoryGrouping";

const records = [
  { id: 6, location: "Pump House", sortDate: "2022-05-01", title: "Water softener" },
  { id: 3, location: "Boat House", sortDate: "2021-11-01", title: "Remodel" },
  { id: 4, location: "Main House", sortDate: "2018-11-21", title: "Bedroom window" },
  { id: 2, location: "Boat House", sortDate: "2020-02-01", title: "Dock floats" },
  { id: 8, location: "Undetermined", sortDate: "2021-10-01", title: "Unknown roof" },
  { id: 5, location: "Main House", sortDate: "2020-03-01", title: "Basement walls" },
  { id: 1, location: "Boat House", sortDate: "2020-02-01", title: "Same-day entry" },
] as const;

describe("location-first work history", () => {
  it("groups locations alphabetically and shows each location's entries oldest to newest", () => {
    const groups = groupWorkRecordsByLocation(records);
    expect(groups.map((group) => group.location)).toEqual([
      "Boat House", "Main House", "Pump House", "Undetermined",
    ]);
    expect(groups[0].records.map((record) => record.id)).toEqual([1, 2, 3]);
    expect(groups[1].records.map((record) => record.id)).toEqual([4, 5]);
    expect(groups.flatMap((group) => group.records)).toHaveLength(records.length);
  });

  it("keeps undetermined and blank locations last and does not mutate the input", () => {
    const input = [
      { id: 7, location: "", sortDate: "2023-01-01" },
      { id: 8, location: "The Chalet", sortDate: "2016-02-01" },
      { id: 9, location: "Undetermined", sortDate: "2021-10-01" },
    ];
    const original = structuredClone(input);
    const groups = groupWorkRecordsByLocation(input);
    expect(groups.map((group) => group.location)).toEqual(["The Chalet", "Undetermined"]);
    expect(groups[1].records.map((record) => record.id)).toEqual([9, 7]);
    expect(input).toEqual(original);
  });

  it("only groups records passed from active search, location, or review filters", () => {
    const matching = records.filter((record) => record.location === "Main House");
    expect(groupWorkRecordsByLocation(matching).map((group) => group.records.map((record) => record.id))).toEqual([[4, 5]]);
    expect(groupWorkRecordsByLocation([])).toEqual([]);
  });
});
