import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  time,
  timestamp,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const attendanceStatusEnum = pgEnum("attendance_status", [
  "PRESENT",
  "ABSENT",
  "HALF_DAY",
  "WFH",
]);

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  checkIn: time("check_in"),
  checkOut: time("check_out"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
