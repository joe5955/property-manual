import { int, bigint, mysqlEnum, mysqlTable, text, timestamp, varchar, float, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Map pins for the interactive site plan viewer.
 * Each pin represents a physical location on the property with photos and notes.
 */
export const mapPins = mysqlTable("map_pins", {
  id: int("id").autoincrement().primaryKey(),
  /** Which map sheet this pin belongs to (1-7) */
  sheetId: int("sheetId").notNull().default(1),
  /** Display label */
  title: varchar("title", { length: 255 }).notNull(),
  /** Longer description / notes */
  notes: text("notes"),
  /**
   * Utility/category type for layer filtering.
   * electrical | water | irrigation | gas | septic | lighting | building | excavation | other
   */
  category: varchar("category", { length: 64 }).notNull().default("other"),
  /**
   * Position as percentage of image dimensions (0-100).
   */
  positionX: float("positionX").notNull(),
  positionY: float("positionY").notNull(),
  /** JSON-encoded array of CDN photo URLs (stored as text for TiDB compatibility) */
  photos: text("photos"),
  /** Link to a manual section/subsection (optional) */
  manualSectionId: varchar("manualSectionId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type MapPin = typeof mapPins.$inferSelect;
export type InsertMapPin = typeof mapPins.$inferInsert;

/**
 * Map routes (polylines) for the interactive site plan viewer.
 * Each route represents a buried conduit, cable run, pipe, or other linear feature.
 * Points are stored as a JSON array of {x, y} percentage coordinates.
 */
export const mapRoutes = mysqlTable("map_routes", {
  id: int("id").autoincrement().primaryKey(),
  /** Which map sheet this route belongs to */
  sheetId: int("sheetId").notNull().default(1),
  /** Display label */
  title: varchar("title", { length: 255 }).notNull(),
  /** Longer description / notes */
  notes: text("notes"),
  /**
   * Utility/category type for layer filtering.
   * electrical | water | irrigation | gas | septic | fiber | other
   */
  category: varchar("category", { length: 64 }).notNull().default("other"),
  /** Hex color for the polyline, e.g. #f97316 */
  color: varchar("color", { length: 16 }).notNull().default("#f97316"),
  /** JSON-encoded array of {x, y} objects (percentage of image dimensions 0-100) */
  points: text("points").notNull(),
  /** JSON-encoded array of CDN photo URLs */
  photos: text("photos"),
  /** Link to a manual section/subsection (optional) */
  manualSectionId: varchar("manualSectionId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type MapRoute = typeof mapRoutes.$inferSelect;
export type InsertMapRoute = typeof mapRoutes.$inferInsert;

/**
 * Document Vault — uploaded property documents (warranties, permits, insurance, surveys, legal).
 * File bytes live in S3; this table stores metadata and the storage key/URL.
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  /** Human-readable title (e.g. "Beach House Insurance Policy 2025") */
  title: varchar("title", { length: 255 }).notNull(),
  /**
   * Document category for filtering.
   * warranty | permit | insurance | survey | legal | estimate | manual | maintenance | other
   */
  category: varchar("category", { length: 64 }).notNull().default("other"),
  /** Original filename as uploaded */
  filename: varchar("filename", { length: 512 }).notNull(),
  /** S3 storage key */
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  /** Public-facing URL (e.g. /manus-storage/...) */
  fileUrl: text("fileUrl").notNull(),
  /** MIME type (application/pdf, image/jpeg, etc.) */
  mimeType: varchar("mimeType", { length: 128 }).notNull().default("application/octet-stream"),
  /** File size in bytes */
  fileSize: bigint("fileSize", { mode: "number" }).notNull().default(0),
  /** Optional: associate with a building/section */
  building: varchar("building", { length: 128 }),
  /** Free-form notes about this document */
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Vendor/Contractor Directory — service providers for the property.
 * Stores contact info, trade category, and optional association with a building.
 */
export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  /** Contact name (person) */
  name: varchar("name", { length: 255 }).notNull(),
  /** Company/business name */
  company: varchar("company", { length: 255 }),
  /**
   * Trade/service category.
   * roofing | plumbing | electrical | hvac | septic | general | landscaping | marine | appliance | pest | well | other
   */
  trade: varchar("trade", { length: 64 }).notNull().default("other"),
  /** Primary phone number */
  phone: varchar("phone", { length: 32 }),
  /** Email address */
  email: varchar("email", { length: 320 }),
  /** Website URL */
  website: varchar("website", { length: 512 }),
  /** Free-form notes (e.g. "Good for emergency calls", "Island-based") */
  notes: text("notes"),
  /** Optional: associate with a building/section */
  building: varchar("building", { length: 128 }),
  /** Contractor license/registration number */
  license: varchar("license", { length: 128 }),
  /** 1-5 star rating (optional) */
  rating: int("rating"),
  /** Last date this vendor was used */
  lastUsed: timestamp("lastUsed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;

/**
 * Historical record of completed work around the property.
 * The archive is intentionally partial: uncertain handwriting is preserved and flagged for review.
 */
export const workRecords = mysqlTable("work_records", {
  id: int("id").autoincrement().primaryKey(),
  /** Stable idempotency key for imported handwritten records. */
  sourceKey: varchar("sourceKey", { length: 160 }).notNull(),
  /** ISO-like YYYY-MM-DD key used for chronological sorting; approximate dates use day 01. */
  sortDate: varchar("sortDate", { length: 10 }).notNull(),
  /** Human-readable date as written or interpreted (for example, "February–March 2024"). */
  dateLabel: varchar("dateLabel", { length: 128 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).notNull().default("other"),
  location: varchar("location", { length: 160 }).notNull().default("Property-wide"),
  /** Archived photograph of the handwritten source page. */
  sourceImageUrl: text("sourceImageUrl"),
  sourceImageFilename: varchar("sourceImageFilename", { length: 512 }),
  /** Best-effort literal transcription for auditability. */
  sourceText: text("sourceText"),
  /** 1 when the transcription, date, or location needs owner confirmation. */
  needsReview: int("needsReview").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  sourceKeyUnique: uniqueIndex("work_records_source_key_unique").on(table.sourceKey),
}));
export type WorkRecord = typeof workRecords.$inferSelect;
export type InsertWorkRecord = typeof workRecords.$inferInsert;
