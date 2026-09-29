import { readFile } from "node:fs/promises";

const manifestUrl = new URL("../server/data/work-records-seed.json", import.meta.url);
const records = JSON.parse(await readFile(manifestUrl, "utf8"));

const columns = [
  "sourceKey",
  "sortDate",
  "dateLabel",
  "title",
  "description",
  "category",
  "location",
  "sourceImageUrl",
  "sourceImageFilename",
  "sourceText",
  "needsReview",
  "notes",
];

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "number") return String(value);
  return `'${String(value).replaceAll("\\", "\\\\").replaceAll("'", "''")}'`;
}

if (!Array.isArray(records) || records.length === 0) {
  throw new Error("work-records-seed.json must contain at least one record");
}

const keys = new Set();
for (const [index, record] of records.entries()) {
  for (const column of columns) {
    if (!(column in record)) throw new Error(`Record ${index} is missing ${column}`);
  }
  if (keys.has(record.sourceKey)) throw new Error(`Duplicate sourceKey: ${record.sourceKey}`);
  keys.add(record.sourceKey);
}

const rows = records.map((record) =>
  `  (${columns.map((column) => sqlValue(record[column])).join(", ")})`,
);

const statement = [
  "START TRANSACTION;",
  `INSERT INTO \`work_records\` (${columns.map((column) => `\`${column}\``).join(", ")}) VALUES`,
  rows.join(",\n"),
  "ON DUPLICATE KEY UPDATE `sourceKey` = VALUES(`sourceKey`);",
  "COMMIT;",
  "",
].join("\n");

process.stdout.write(statement);
