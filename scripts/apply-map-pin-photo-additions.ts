import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import mysql, { type RowDataPacket } from "mysql2/promise";
import { appendMapPinNote, appendUniqueMapPinPhotos } from "../server/mapPinPhotoAdditions";

interface PhotoAddition {
  pinId: number;
  sheetId: number;
  expectedTitle: string;
  title: string;
  category: string;
  notesToAppend: string;
  preserveExistingPhotos: boolean;
  preservePosition: boolean;
  photos: { url: string }[];
}

const apply = process.argv.includes("--apply");
const manifest = JSON.parse(readFileSync(fileURLToPath(new URL("../server/data/map-pin-photo-additions.json", import.meta.url)), "utf8")) as PhotoAddition[];
const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const decodePhotos = (value: unknown): string[] => typeof value === "string" ? JSON.parse(value) : (value as string[] ?? []);

try {
  await connection.beginTransaction();
  const [before] = await connection.query<RowDataPacket[]>("SELECT * FROM map_pins ORDER BY id");
  if (before.length < 27) throw new Error("Expected at least the 27 preserved map pins; stop and investigate before applying.");
  if (new Set(manifest.map(item => item.pinId)).size !== manifest.length) throw new Error("Duplicate target pin in manifest");

  if (apply) {
    const directory = "/home/ubuntu/property-manual-private-backups";
    mkdirSync(directory, { recursive: true });
    writeFileSync(`${directory}/map-pins-before-photo-addition-${Date.now()}.json`, `${JSON.stringify(before, null, 2)}\n`, { mode: 0o600 });
  }

  const changes: { pinId: number; addedPhotos: number; totalPhotos: number; changed: boolean }[] = [];
  for (const item of manifest) {
    if (!item.preservePosition || !item.preserveExistingPhotos) throw new Error("Manifest must preserve pin positions and existing photos");
    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM map_pins WHERE id = ? FOR UPDATE", [item.pinId]);
    const pin = rows[0];
    if (!pin || pin.sheetId !== item.sheetId || pin.category !== item.category || ![item.expectedTitle, item.title].includes(pin.title)) {
      throw new Error(`Pin ${item.pinId} does not match the owner-confirmed target`);
    }
    const existing = decodePhotos(pin.photos);
    const photos = appendUniqueMapPinPhotos(existing, item.photos.map(photo => photo.url));
    const notes = appendMapPinNote(pin.notes, item.notesToAppend);
    const changed = JSON.stringify(existing) !== JSON.stringify(photos) || pin.notes !== notes || pin.title !== item.title;
    if (apply && changed) {
      await connection.execute("UPDATE map_pins SET title = ?, notes = ?, photos = ? WHERE id = ?", [item.title, notes, JSON.stringify(photos), item.pinId]);
    }
    changes.push({ pinId: item.pinId, addedPhotos: photos.length - existing.length, totalPhotos: photos.length, changed });
  }

  const [after] = await connection.query<RowDataPacket[]>("SELECT * FROM map_pins ORDER BY id");
  if (after.length !== before.length) throw new Error("Map pin inventory changed; rolling back");
  const targetIds = new Set(manifest.map(item => item.pinId));
  for (let i = 0; i < before.length; i++) {
    const oldPin = before[i], newPin = after[i];
    const unchangedFields = (pin: RowDataPacket) => Object.fromEntries(Object.entries(pin).filter(([key]) => !["title", "notes", "photos", "updatedAt"].includes(key)));
    const previous = targetIds.has(oldPin.id) ? unchangedFields(oldPin) : oldPin;
    const current = targetIds.has(oldPin.id) ? unchangedFields(newPin) : newPin;
    if (JSON.stringify(previous) !== JSON.stringify(current)) throw new Error(`Unintended metadata or location change for pin ${oldPin.id}; rolling back`);
  }
  if (apply) await connection.commit();
  else await connection.rollback();
  console.log(JSON.stringify({ mode: apply ? "applied" : "dry-run", preservedPins: before.length, changes }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
