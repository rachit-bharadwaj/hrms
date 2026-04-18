import {
  boolean,
  date,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const leaveTypes = pgTable("leave_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  annualQuota: doublePrecision("annual_quota").notNull(),
  maxCarryForward: doublePrecision("max_carry_forward").default(0).notNull(),
  encashable: boolean("encashable").default(false).notNull(),
  requiresApprovalBy: varchar("requires_approval_by", { length: 50 }), // e.g., MANAGER, HR
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leaveBalances = pgTable("leave_balances", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  leaveTypeId: uuid("leave_type_id")
    .references(() => leaveTypes.id)
    .notNull(),
  year: integer("year").notNull(),
  openingBalance: doublePrecision("opening_balance").default(0).notNull(),
  accrued: doublePrecision("accrued").default(0).notNull(),
  availed: doublePrecision("availed").default(0).notNull(),
  closingBalance: doublePrecision("closing_balance").default(0).notNull(),
});

export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  leaveTypeId: uuid("leave_type_id")
    .references(() => leaveTypes.id)
    .notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  days: doublePrecision("days").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(), // PENDING, APPROVED, REJECTED
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  approverEmployeeId: uuid("approver_employee_id").references(
    () => employees.id,
  ),
  decisionAt: timestamp("decision_at"),
  decisionRemarks: text("decision_remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
