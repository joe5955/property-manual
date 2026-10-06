import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import mysql from "mysql2/promise";

// Usage: node scripts/apply-map-pin-location-corrections.mjs [--apply]
// Dry-run by default; never uses a route update or creates/deletes pins.
const apply = process.argv.includes("--apply");
const corrections = JSON.parse(readFileSync(new URL("../server/data/map-pin-location-corrections.json", import.meta.url), "utf8"));
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!Array.isArray(corrections) || corrections.length === 0) throw new Error("No pin corrections found");
if (new Set(corrections.map(c => c.pinId)).size !== corrections.length) throw new Error("Duplicate pin correction ID");
const near = (a, b) => Math.abs(Number(a) - Number(b)) < 0.0001;
const checksum = rows => createHash("sha256").update(JSON.stringify(rows)).digest("hex");
const db = await mysql.createConnection(process.env.DATABASE_URL);
let committed = false;
try {
  await db.beginTransaction();
  const [before] = await db.query("SELECT * FROM map_pins ORDER BY id FOR UPDATE");
  if (before.length !== 27) throw new Error(`Expected all 27 saved pins; found ${before.length}`);
  for (const correction of corrections) {
    const old = before.find(pin => pin.id === correction.pinId);
    if (!old || old.sheetId !== correction.sheetId || old.title !== correction.title || old.category !== correction.category) {
      throw new Error(`Pin identity mismatch: ${correction.pinId}`);
    }
    const alreadyCorrect = near(old.positionX, correction.position.x) && near(old.positionY, correction.position.y);
    if (alreadyCorrect) {
      console.log(`Already at owner-approved site: ${old.id} ${old.title}`);
      continue;
    }
    if (!near(old.positionX, correction.previousPosition.x) || !near(old.positionY, correction.previousPosition.y)) {
      throw new Error(`Unexpected current position for pin ${old.id}; do not overwrite another move`);
    }
    console.log(`${apply ? "Moving" : "Would move"}: ${old.id} ${old.title} on sheet ${old.sheetId} from (${old.positionX}, ${old.positionY}) to (${correction.position.x}, ${correction.position.y})`);
    if (apply) {
      const [result] = await db.execute(
        "UPDATE map_pins SET positionX=?, positionY=? WHERE id=? AND sheetId=? AND title=? AND category=? AND positionX=? AND positionY=?",
        [correction.position.x, correction.position.y, correction.pinId, correction.sheetId, correction.title, correction.category, correction.previousPosition.x, correction.previousPosition.y],
      );
      if (result.affectedRows !== 1) throw new Error(`Guarded update failed for pin ${old.id}`);
    }
  }
  const [after] = await db.query("SELECT * FROM map_pins ORDER BY id");
  if (after.length !== before.length || after.length !== 27) throw new Error("Pin inventory count changed");
  const changed = new Set(corrections.map(c => c.pinId));
  if (checksum(after.filter(p => !changed.has(p.id))) !== checksum(before.filter(p => !changed.has(p.id)))) {
    throw new Error("An unrelated pin changed during the transaction");
  }
  if (apply) {
    for (const correction of corrections) {
      const current = after.find(p => p.id === correction.pinId);
      if (!near(current.positionX, correction.position.x) || !near(current.positionY, correction.position.y)) {
        throw new Error(`Pin ${correction.pinId} did not land at the expected position`);
      }
    }
    await db.commit();
    committed = true;
    console.log(`Committed ${corrections.length} verified correction(s); all ${after.length} saved pins remain.`);
  } else {
    await db.rollback();
    console.log(`Dry run passed; all ${after.length} saved pins remain unchanged.`);
  }
} catch (error) {
  if (!committed) await db.rollback();
  throw error;
} finally {
  await db.end();
}
