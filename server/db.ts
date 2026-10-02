import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ── Map Pins ──────────────────────────────────────────────────────────────────
import { mapPins, InsertMapPin, MapPin, mapRoutes, InsertMapRoute, MapRoute, documents, InsertDocument, Document, vendors, InsertVendor, Vendor, workRecords, InsertWorkRecord, WorkRecord, propertyTasks, InsertPropertyTask, PropertyTask, taskTimeEntries, InsertTaskTimeEntry, TaskTimeEntry } from "../drizzle/schema";

export async function getMapPins(sheetId?: number): Promise<MapPin[]> {
  const db = await getDb();
  if (!db) return [];
  if (sheetId !== undefined) {
    return db.select().from(mapPins).where(eq(mapPins.sheetId, sheetId));
  }
  return db.select().from(mapPins);
}

export async function createMapPin(pin: InsertMapPin): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(mapPins).values(pin);
  return (result[0] as any).insertId as number;
}

export async function updateMapPin(id: number, data: Partial<InsertMapPin>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(mapPins).set(data).where(eq(mapPins.id, id));
}

export async function deleteMapPin(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(mapPins).where(eq(mapPins.id, id));
}

// ── Map Routes ───────────────────────────────────────────────────────────────

export async function getMapRoutes(sheetId?: number): Promise<MapRoute[]> {
  const db = await getDb();
  if (!db) return [];
  if (sheetId !== undefined) {
    return db.select().from(mapRoutes).where(eq(mapRoutes.sheetId, sheetId));
  }
  return db.select().from(mapRoutes);
}

export async function createMapRoute(route: InsertMapRoute): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(mapRoutes).values(route);
  return (result[0] as any).insertId as number;
}

export async function updateMapRoute(id: number, data: Partial<InsertMapRoute>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(mapRoutes).set(data).where(eq(mapRoutes.id, id));
}

export async function deleteMapRoute(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(mapRoutes).where(eq(mapRoutes.id, id));
}

// ── Documents ────────────────────────────────────────────────────────────────

export async function getDocuments(category?: string, building?: string): Promise<Document[]> {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(documents);
  if (category) {
    query = query.where(eq(documents.category, category)) as any;
  }
  if (building) {
    query = query.where(eq(documents.building, building)) as any;
  }
  return (query as any).orderBy(desc(documents.createdAt));
}

export async function createDocument(doc: InsertDocument): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(documents).values(doc);
  return (result[0] as any).insertId as number;
}

export async function deleteDocument(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(documents).where(eq(documents.id, id));
}

export async function getDocumentById(id: number): Promise<Document | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── Vendors ──────────────────────────────────────────────────────────────────

export async function getVendors(trade?: string): Promise<Vendor[]> {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(vendors);
  if (trade) {
    query = query.where(eq(vendors.trade, trade)) as any;
  }
  return (query as any).orderBy(desc(vendors.updatedAt));
}

export async function createVendor(vendor: InsertVendor): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(vendors).values(vendor);
  return (result[0] as any).insertId as number;
}

export async function updateVendor(id: number, data: Partial<InsertVendor>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(vendors).set(data).where(eq(vendors.id, id));
}

export async function deleteVendor(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(vendors).where(eq(vendors.id, id));
}

export async function getVendorById(id: number): Promise<Vendor | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── Work Records ─────────────────────────────────────────────────────────────

export type WorkRecordFilters = {
  category?: string;
  location?: string;
  needsReview?: boolean;
};

export async function getWorkRecords(filters: WorkRecordFilters = {}): Promise<WorkRecord[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters.category) conditions.push(eq(workRecords.category, filters.category));
  if (filters.location) conditions.push(eq(workRecords.location, filters.location));
  if (filters.needsReview !== undefined) {
    conditions.push(eq(workRecords.needsReview, filters.needsReview ? 1 : 0));
  }

  const query = db.select().from(workRecords);
  const filtered = conditions.length > 0 ? query.where(and(...conditions)) : query;
  return filtered.orderBy(asc(workRecords.sortDate), asc(workRecords.id));
}

export async function createWorkRecord(record: InsertWorkRecord): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(workRecords).values(record);
  return (result[0] as any).insertId as number;
}

export async function updateWorkRecord(id: number, data: Partial<InsertWorkRecord>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(workRecords).set(data).where(eq(workRecords.id, id));
}

export async function deleteWorkRecord(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(workRecords).where(eq(workRecords.id, id));
}

export async function importWorkRecords(records: InsertWorkRecord[]): Promise<{ inserted: number; existing: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let inserted = 0;
  let existing = 0;
  for (const record of records) {
    const present = await db
      .select({ id: workRecords.id })
      .from(workRecords)
      .where(eq(workRecords.sourceKey, record.sourceKey))
      .limit(1);
    if (present.length > 0) {
      existing += 1;
      continue;
    }
    await db.insert(workRecords).values(record);
    inserted += 1;
  }
  return { inserted, existing };
}

// ── Property Tasks and Actual Time ──────────────────────────────────────────

export async function getPropertyTasks(): Promise<PropertyTask[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(propertyTasks).orderBy(desc(propertyTasks.updatedAt), desc(propertyTasks.id));
}

export async function getPropertyTask(id: number): Promise<PropertyTask | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return (await db.select().from(propertyTasks).where(eq(propertyTasks.id, id)).limit(1))[0];
}

export async function createPropertyTask(task: InsertPropertyTask): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(propertyTasks).values(task);
  return (result[0] as any).insertId as number;
}

export async function updatePropertyTask(id: number, data: Partial<InsertPropertyTask>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(propertyTasks).set(data).where(eq(propertyTasks.id, id));
}

export async function getTaskTimeEntries(): Promise<TaskTimeEntry[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(taskTimeEntries).orderBy(desc(taskTimeEntries.workedAt), desc(taskTimeEntries.id));
}

export async function createTaskTimeEntry(entry: InsertTaskTimeEntry): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(taskTimeEntries).values(entry);
  return (result[0] as any).insertId as number;
}

export async function deleteTaskTimeEntry(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(taskTimeEntries).where(eq(taskTimeEntries.id, id));
}
