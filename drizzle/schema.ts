import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, float } from "drizzle-orm/mysql-core";

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