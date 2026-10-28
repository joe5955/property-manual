import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import mysql, { type RowDataPacket } from "mysql2/promise";
import { appendMapPinNote, appendUniqueMapPinPhotos, detachMapPinNote, detachMapPinPhotos } from "../server/mapPinPhotoAdditions";

interface PhotoAddition {
  pinId: number;
  sheetId: number;
  expectedTitle: string;
  title: string;
  category: string;
  positionX?: number;
  positionY?: number;
  createIfMissing?: boolean;
  notesToAppend: string;
  preserveExistingPhotos: boolean;
  preservePosition: boolean;
  previousAssignment?: {
    pinId: number;
    sheetId: number;
    originalTitle: string;
    renamedTitle: string;
    addedNote: string;
    preserveOriginalPhoto: string;
    preservePosition: boolean;
  };
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

  let plannedCreates = 0;
  const allowedMetadataIds = new Set<number>();
  const changes: { pinId: number; created: boolean; addedPhotos: number; totalPhotos: number; changed: boolean; detachedFrom?: number; detachedPhotos?: number }[] = [];
  for (const item of manifest) {
    if (!item.preservePosition || !item.preserveExistingPhotos) throw new Error("Manifest must preserve pin positions and existing photos");
    const additions = item.photos.map(photo => photo.url);
    const previous = item.previousAssignment;
    let detachedPhotos = 0;
    if (previous) {
      if (previous.pinId === item.pinId || !previous.preservePosition) throw new Error("Invalid previous assignment");
      const [sources] = await connection.query<RowDataPacket[]>("SELECT * FROM map_pins WHERE id = ? FOR UPDATE", [previous.pinId]);
      const source = sources[0];
      if (!source || source.sheetId !== previous.sheetId || source.category !== item.category) throw new Error("Previous photo pin does not match");
      const existing = decodePhotos(source.photos);
      if (!existing.includes(previous.preserveOriginalPhoto)) throw new Error("Original photo is missing; stop rather than changing the old pin");
      const photos = detachMapPinPhotos(existing, additions);
      const notes = detachMapPinNote(source.notes, previous.addedNote);
      const title = source.title === previous.renamedTitle ? previous.originalTitle : source.title;
      detachedPhotos = existing.length - photos.length;
      if (apply && (detachedPhotos || notes !== source.notes || title !== source.title)) {
        await connection.execute("UPDATE map_pins SET title = ?, notes = ?, photos = ? WHERE id = ?", [title, notes, JSON.stringify(photos), previous.pinId]);
      }
      allowedMetadataIds.add(previous.pinId);
    }

    const [rows] = await connection.query<RowDataPacket[]>("SELECT * FROM map_pins WHERE id = ? FOR UPDATE", [item.pinId]);
    const pin = rows[0];
    if (pin) {
      if (pin.sheetId !== item.sheetId || pin.category !== item.category || ![item.expectedTitle, item.title].includes(pin.title)) throw new Error(`Pin ${item.pinId} does not match the owner-confirmed target`);
      if (item.positionX !== undefined && Math.abs(pin.positionX - item.positionX) > 0.0001) throw new Error("Target X was changed; do not overwrite it silently");
      if (item.positionY !== undefined && Math.abs(pin.positionY - item.positionY) > 0.0001) throw new Error("Target Y was changed; do not overwrite it silently");
    } else {
      if (!item.createIfMissing || !Number.isFinite(item.positionX) || !Number.isFinite(item.positionY) || item.positionX! < 0 || item.positionX! > 100 || item.positionY! < 0 || item.positionY! > 100) throw new Error("Missing target has no valid owner-marked location");
      plannedCreates++;
    }
    const existing = pin ? decodePhotos(pin.photos) : [];
    const photos = appendUniqueMapPinPhotos(existing, additions);
    const notes = appendMapPinNote(pin?.notes ?? null, item.notesToAppend);
    const changed = !pin || JSON.stringify(existing) !== JSON.stringify(photos) || pin.notes !== notes || pin.title !== item.title;
    if (apply && !pin) {
      await connection.execute("INSERT INTO map_pins (id, sheetId, title, notes, category, positionX, positionY, photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [item.pinId, item.sheetId, item.title, notes, item.category, item.positionX, item.positionY, JSON.stringify(photos)]);
    } else if (apply && changed) {
      await connection.execute("UPDATE map_pins SET title = ?, notes = ?, photos = ? WHERE id = ?", [item.title, notes, JSON.stringify(photos), item.pinId]);
    }
    allowedMetadataIds.add(item.pinId);
    changes.push({ pinId: item.pinId, created: !pin, addedPhotos: photos.length - existing.length, totalPhotos: photos.length, changed, ...(previous ? { detachedFrom: previous.pinId, detachedPhotos } : {}) });
  }

  const [after] = await connection.query<RowDataPacket[]>("SELECT * FROM map_pins ORDER BY id");
  if (after.length !== before.length + (apply ? plannedCreates : 0)) throw new Error("Unexpected map pin inventory change; rolling back");
  const afterById = new Map(after.map(pin => [pin.id, pin]));
  const unchangedFields = (pin: RowDataPacket) => Object.fromEntries(Object.entries(pin).filter(([key]) => !["title", "notes", "photos", "updatedAt"].includes(key)));
  for (const oldPin of before) {
    const newPin = afterById.get(oldPin.id);
    if (!newPin) throw new Error(`Original pin ${oldPin.id} disappeared; rolling back`);
    const previous = allowedMetadataIds.has(oldPin.id) ? unchangedFields(oldPin) : oldPin;
    const current = allowedMetadataIds.has(oldPin.id) ? unchangedFields(newPin) : newPin;
    if (JSON.stringify(previous) !== JSON.stringify(current)) throw new Error(`Unintended metadata or location change for pin ${oldPin.id}; rolling back`);
  }
  if (apply) await connection.commit();
  else await connection.rollback();
  console.log(JSON.stringify({ mode: apply ? "applied" : "dry-run", preservedOriginalPins: before.length, createdPins: plannedCreates, resultingPins: before.length + plannedCreates, changes }, null, 2));
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
