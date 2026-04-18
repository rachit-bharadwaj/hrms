import {
  date,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const holidayTypeEnum = pgEnum("holiday_type", [
  "NATIONAL",
  "REGIONAL",
  "COMPANY",
]);

export const holidays = pgTable("holidays", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  date: date("date").notNull().unique(),
  type: holidayTypeEnum("type").default("NATIONAL").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
