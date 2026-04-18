import {
  AnyPgColumn,
  date,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { departments } from "./departments";
import { users } from "./users";

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull()
    .unique(),
  employeeCode: varchar("employee_code", { length: 50 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dob: date("dob").notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  emailOfficial: varchar("email_official", { length: 255 }).notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  photoUrl: text("photo_url"),
  designation: varchar("designation", { length: 100 }).notNull(),
  departmentId: uuid("department_id")
    .references(() => departments.id)
    .notNull(),
  joiningDate: date("joining_date").notNull(),
  employmentType: varchar("employment_type", { length: 50 }).notNull(), // e.g., Full-time, Contract
  status: varchar("status", { length: 50 }).notNull(), // e.g., Active, Resigned, On Leave
  managerEmployeeId: uuid("manager_employee_id").references(
    (): AnyPgColumn => employees.id,
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const employeeDocuments = pgTable("employee_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  fileUrl: text("file_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const employmentHistory = pgTable("employment_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date"),
  departmentId: uuid("department_id")
    .references(() => departments.id)
    .notNull(),
  designation: varchar("designation", { length: 100 }).notNull(),
  remarks: text("remarks"),
});
