import { date, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const holidays = pgTable("holidays", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // e.g., National, Optional
  location: varchar("location", { length: 100 }), // e.g., All, Specific City
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
