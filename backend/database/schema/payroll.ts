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
import { users } from "./users";

export const salaryStructures = pgTable("salary_structures", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull()
    .unique(),
  effectiveFrom: date("effective_from").notNull(),
  basic: doublePrecision("basic").notNull(),
  hra: doublePrecision("hra").notNull(),
  otherAllowances: doublePrecision("other_allowances").default(0).notNull(),
  otherEarnings: doublePrecision("other_earnings").default(0).notNull(),
  pfApplicable: boolean("pf_applicable").default(true).notNull(),
  esiApplicable: boolean("esi_applicable").default(true).notNull(),
  tdsRatePercent: doublePrecision("tds_rate_percent").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payrollRuns = pgTable("payroll_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  status: varchar("status", { length: 50 }).notNull(), // e.g., DRAFT, PROCESSED, COMPLETED
  processedByUserId: uuid("processed_by_user_id")
    .references(() => users.id)
    .notNull(),
  processedAt: timestamp("processed_at"),
});

export const payslips = pgTable("payslips", {
  id: uuid("id").primaryKey().defaultRandom(),
  payrollRunId: uuid("payroll_run_id")
    .references(() => payrollRuns.id)
    .notNull(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  grossEarnings: doublePrecision("gross_earnings").notNull(),
  pfEmployee: doublePrecision("pf_employee").notNull(),
  pfEmployer: doublePrecision("pf_employer").notNull(),
  esiEmployee: doublePrecision("esi_employee").notNull(),
  esiEmployer: doublePrecision("esi_employer").notNull(),
  tds: doublePrecision("tds").notNull(),
  otherDeductions: doublePrecision("other_deductions").default(0).notNull(),
  netPay: doublePrecision("net_pay").notNull(),
  payslipNumber: varchar("payslip_number", { length: 100 }).notNull().unique(),
  payslipPdfUrl: text("payslip_pdf_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payslipComponents = pgTable("payslip_components", {
  id: uuid("id").primaryKey().defaultRandom(),
  payslipId: uuid("payslip_id")
    .references(() => payslips.id)
    .notNull(),
  type: varchar("type", { length: 50 }).notNull(), // EARNING, DEDUCTION
  code: varchar("code", { length: 50 }).notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  amount: doublePrecision("amount").notNull(),
});
