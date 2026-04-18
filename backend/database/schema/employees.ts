import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { departments } from "./departments";
import { users } from "./users";

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
  employeeId: varchar("employee_id", { length: 50 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dob: date("dob").notNull(),
  contact: varchar("contact", { length: 20 }).notNull(),
  address: text("address").notNull(),
  photoUrl: text("photo_url"),
  designation: varchar("designation", { length: 100 }).notNull(),
  departmentId: integer("department_id")
    .references(() => departments.id)
    .notNull(),
  joiningDate: date("joining_date").notNull(),
  aadhar: varchar("aadhar", { length: 20 }).unique(),
  pan: varchar("pan", { length: 20 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  type: varchar("type", { length: 50 }).notNull(), // e.g., 'AADHAR', 'PAN', 'OFFER_LETTER'
  url: text("url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});
