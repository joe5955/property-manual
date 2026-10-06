import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

// Usage: node scripts/verify-map-pin-inventory.mjs /private/path/to/before.json
const backupPath = process.argv[2];
if (!backupPath || !process.env.DATABASE_URL) throw new Error("Supply a private pre-change backup and DATABASE_URL");
const before = JSON.parse(readFileSync(backupPath, "utf8"));
const connection = await mysql.createConnection(process.env.DATABASE_URL);
let after;
try {
  const [rows] = await connection.query("SELECT * FROM map_pins ORDER BY id");
  after = JSON.parse(JSON.stringify(rows)); // Normalize the driver's Date values to backup ISO strings.
} finally {
  await connection.end();
}
assert.equal(before.length, 27, "Pre-change inventory must contain all 27 pins");
assert.equal(after.length, 27, "Post-change inventory must contain all 27 pins");
for (let i = 0; i < before.length; i++) {
  const original = before[i];
  const current = after[i];
  assert.equal(current.id, original.id, "Pin ordering or identity changed");
  if (original.id !== 90002) {
    assert.deepEqual(current, original, `Unrelated pin ${original.id} changed`);
  } else {
    for (const key of Object.keys(original).filter(k => !["positionX", "positionY", "updatedAt"].includes(k))) {
      assert.deepEqual(current[key], original[key], `Pin 90002 metadata ${key} changed`);
    }
    assert.ok(Math.abs(current.positionX - 59.5) < 0.001);
    assert.ok(Math.abs(current.positionY - 47) < 0.001);
  }
}
console.log("Live database: all 27 pins preserved; only Main House fiber marker 90002 changed position.");
