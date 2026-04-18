import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "HR_ADMIN",
  "MANAGER",
  "EMPLOYEE",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").default("EMPLOYEE").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  accountActivated: boolean("account_activated").default(false).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
