import connectDB from "../database/connection";
import { users, roles, permissions, rolePermissions } from "../database/schema";
import crypto from "node:crypto";

const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

async function seed() {
  console.log("🌱 Starting database seeding...");
  const db = await connectDB();

  try {
    // 1. Create Super Admin Role
    console.log("Creating Super Admin role...");
    const [superAdminRole] = await db.insert(roles).values({
      name: "Super Admin",
      description: "Root user with full system access",
    }).onConflictDoNothing().returning();

    const roleId = superAdminRole?.id || (await db.select().from(roles).where({ name: "Super Admin" }))[0].id;

    // 2. Create Master Permission
    console.log("Creating Master permission...");
    const [allAccessPermission] = await db.insert(permissions).values({
      code: "ALL_ACCESS",
      description: "Grants access to all modules and operations",
    }).onConflictDoNothing().returning();

    const permissionId = allAccessPermission?.id || (await db.select().from(permissions).where({ code: "ALL_ACCESS" }))[0].id;

    // 3. Link Permission to Role
    console.log("Linking permission to role...");
    await db.insert(rolePermissions).values({
      roleId,
      permissionId,
    }).onConflictDoNothing();

    // 4. Create Super Admin User
    console.log("Creating Super Admin user...");
    await db.insert(users).values({
      email: "admin@harbor.hr",
      passwordHash: hashPassword("admin123"), // Default password
      roleId,
      isActive: true,
    }).onConflictDoNothing();

    console.log("✅ Seeding completed successfully!");
    console.log("----------------------------------");
    console.log("Super Admin Email: admin@harbor.hr");
    console.log("Super Admin Password: admin123");
    console.log("----------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
