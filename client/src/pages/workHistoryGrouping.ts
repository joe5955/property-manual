type LocatedWorkRecord = {
  id: number;
  location: string;
  sortDate: string;
};

/** Group by location A–Z, with undetermined locations last and dates oldest first. */
export function groupWorkRecordsByLocation<T extends LocatedWorkRecord>(records: readonly T[]) {
  const groups = new Map<string, T[]>();

  for (const record of records) {
    const location = record.location.trim() || "Undetermined";
    const group = groups.get(location) ?? [];
    group.push(record);
    groups.set(location, group);
  }

  return Array.from(groups.entries())
    .sort(([left], [right]) => {
      if (left === "Undetermined") return 1;
      if (right === "Undetermined") return -1;
      return left.localeCompare(right, "en", { sensitivity: "base" });
    })
    .map(([location, entries]) => ({
      location,
      records: [...entries].sort((left, right) =>
        left.sortDate.localeCompare(right.sortDate) || left.id - right.id,
      ),
    }));
}
