import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { users } from "./users";

export const taskStatusEnum = pgEnum("task_status", [
  "TO_DO",
  "IN_PROGRESS",
  "COMPLETED",
]);
export const taskPriorityEnum = pgEnum("task_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
]);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  assignedTo: integer("assigned_to")
    .references(() => employees.id)
    .notNull(),
  assignedBy: integer("assigned_by")
    .references(() => users.id)
    .notNull(),
  status: taskStatusEnum("status").default("TO_DO").notNull(),
  priority: taskPriorityEnum("priority").default("MEDIUM").notNull(),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
