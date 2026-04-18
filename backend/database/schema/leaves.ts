import {
  date,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { users } from "./users";

export const leaveTypeEnum = pgEnum("leave_type", ["CL", "SL", "EL"]);
export const leaveStatusEnum = pgEnum("leave_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const leaveApplications = pgTable("leave_applications", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  leaveType: leaveTypeEnum("leave_type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason").notNull(),
  status: leaveStatusEnum("status").default("PENDING").notNull(),
  approvedBy: integer("approved_by").references(() => users.id),
  managerComment: text("manager_comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leaveBalances = pgTable("leave_balances", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull()
    .unique(),
  clBalance: decimal("cl_balance", { precision: 4, scale: 1 })
    .default("0.0")
    .notNull(),
  slBalance: decimal("sl_balance", { precision: 4, scale: 1 })
    .default("0.0")
    .notNull(),
  elBalance: decimal("el_balance", { precision: 4, scale: 1 })
    .default("0.0")
    .notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
