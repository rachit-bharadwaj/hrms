import connectDB from "../database/connection";
import { users, roles, permissions, rolePermissions, userRoles } from "../database/schema";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";

const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const permissionCatalog = [
  // Employees
  { code: "employees.view", description: "View employee directory and profiles" },
  { code: "employees.create", description: "Add new employees" },
  { code: "employees.edit", description: "Update employee details" },
  { code: "employees.delete", description: "Remove employees from system" },
  
  // Departments
  { code: "departments.view", description: "View departments and stats" },
  { code: "departments.manage", description: "Create, edit and delete departments" },
  
  // Attendance
  { code: "attendance.view", description: "View attendance records and reports" },
  { code: "attendance.mark", description: "Mark daily attendance" },
  { code: "attendance.export", description: "Export attendance data to CSV/PDF" },
  
  // Leaves
  { code: "leaves.view_own", description: "View own leave requests and balances" },
  { code: "leaves.view_all", description: "View all employee leave requests" },
  { code: "leaves.apply", description: "Apply for leave" },
  { code: "leaves.approve", description: "Approve or reject leave requests" },
  { code: "leaves.manage", description: "Manage leave types and carry-forward" },
  
  // Payroll
  { code: "payroll.view_own", description: "View and download own payslips" },
  { code: "payroll.view_all", description: "View all employee payslips" },
  { code: "payroll.manage", description: "Process payroll and manage salary structures" },
  
  // Tasks
  { code: "tasks.view_own", description: "View and update assigned tasks" },
  { code: "tasks.view_all", description: "View all tasks in the system" },
  { code: "tasks.assign", description: "Assign tasks to employees" },
  { code: "tasks.update", description: "Update task status" },
  { code: "tasks.comment", description: "Add comments to tasks" },
  
  // Holidays
  { code: "holidays.view", description: "View holiday calendar" },
  { code: "holidays.manage", description: "Add or remove holidays" },
  
  // Admin
  { code: "dashboard.view", description: "Access the management dashboard" },
  { code: "users.manage", description: "Manage system users and statuses" },
  { code: "roles.manage", description: "Manage roles and permission mappings" },
];

async function seed() {
  console.log("🌱 Starting database seeding...");
  const db = await connectDB();

  try {
    // 1. Seed Permissions
    console.log("Seeding permissions...");
    for (const perm of permissionCatalog) {
      await db.insert(permissions).values(perm).onConflictDoUpdate({
        target: permissions.code,
        set: { description: perm.description }
      });
    }

    // 2. Create Core Roles
    console.log("Creating core roles...");
    const roleValues = [
      { name: "Super Admin", description: "Full system access" },
      { name: "HR Manager", description: "Manage employees, departments and attendance" },
      { name: "Manager", description: "Manage team attendance, leaves and tasks" },
      { name: "Employee", description: "Standard employee access" },
    ];

    for (const roleVal of roleValues) {
      await db.insert(roles).values(roleVal).onConflictDoNothing();
    }

    // 3. Map Permissions to Roles (Example)
    const allRoles = await db.select().from(roles);
    const allPerms = await db.select().from(permissions);

    const getRoleId = (name: string) => allRoles.find(r => r.name === name)?.id;
    const getPermId = (code: string) => allPerms.find(p => p.code === code)?.id;

    // HR Manager permissions
    const hrManagerId = getRoleId("HR Manager");
    if (hrManagerId) {
      const hrPerms = ["employees.view", "employees.create", "employees.edit", "departments.view", "attendance.view", "leaves.view_all", "dashboard.view"];
      for (const code of hrPerms) {
        const permId = getPermId(code);
        if (permId) {
          await db.insert(rolePermissions).values({ roleId: hrManagerId, permissionId: permId }).onConflictDoNothing();
        }
      }
    }

    // 4. Create Super Admin User
    console.log("Creating Super Admin user...");
    const [adminUser] = await db.insert(users).values({
      email: "admin@harbor.hr",
      passwordHash: hashPassword("admin123"),
      isActive: true,
    }).onConflictDoUpdate({
        target: users.email,
        set: { updatedAt: new Date() }
    }).returning();

    const superAdminRoleId = getRoleId("Super Admin");
    if (adminUser && superAdminRoleId) {
      await db.insert(userRoles).values({
        userId: adminUser.id,
        roleId: superAdminRoleId
      }).onConflictDoNothing();
    }

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
