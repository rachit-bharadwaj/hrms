import {
  date,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  assignedByEmployeeId: uuid("assigned_by_employee_id")
    .references(() => employees.id)
    .notNull(),
  assignedToEmployeeId: uuid("assigned_to_employee_id")
    .references(() => employees.id)
    .notNull(),
  status: varchar("status", { length: 50 }).default("TO_DO").notNull(),
  priority: varchar("priority", { length: 50 }).default("MEDIUM").notNull(),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const taskComments = pgTable("task_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .references(() => tasks.id)
    .notNull(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
