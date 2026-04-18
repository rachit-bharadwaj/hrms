import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const payslipStatusEnum = pgEnum("payslip_status", [
  "PENDING",
  "PAID",
  "CANCELLED",
]);

export const salaryStructures = pgTable("salary_structures", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull()
    .unique(),
  basic: decimal("basic", { precision: 12, scale: 2 }).notNull(),
  hra: decimal("hra", { precision: 12, scale: 2 }).notNull(),
  allowances: decimal("allowances", { precision: 12, scale: 2 })
    .default("0.00")
    .notNull(),
  pfEmployee: decimal("pf_employee", { precision: 12, scale: 2 })
    .default("0.00")
    .notNull(),
  pfEmployer: decimal("pf_employer", { precision: 12, scale: 2 })
    .default("0.00")
    .notNull(),
  esi: decimal("esi", { precision: 12, scale: 2 }).default("0.00").notNull(),
  tds: decimal("tds", { precision: 12, scale: 2 }).default("0.00").notNull(),
  otherDeductions: decimal("other_deductions", { precision: 12, scale: 2 })
    .default("0.00")
    .notNull(),
  netPay: decimal("net_pay", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payslips = pgTable("payslips", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  status: payslipStatusEnum("status").default("PENDING").notNull(),
  pdfUrl: text("pdf_url"),
  // Denormalized data for historical record
  basic: decimal("basic", { precision: 12, scale: 2 }).notNull(),
  hra: decimal("hra", { precision: 12, scale: 2 }).notNull(),
  allowances: decimal("allowances", { precision: 12, scale: 2 }).notNull(),
  pfEmployee: decimal("pf_employee", { precision: 12, scale: 2 }).notNull(),
  esi: decimal("esi", { precision: 12, scale: 2 }).notNull(),
  tds: decimal("tds", { precision: 12, scale: 2 }).notNull(),
  netPay: decimal("net_pay", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
