import connectDB from "../database/connection";
import {
  users,
  roles,
  permissions,
  rolePermissions,
  userRoles,
  departments,
  employees,
  leaveTypes,
  leaveBalances,
  leaveRequests,
  holidays,
  attendanceRecords,
  tasks,
  taskComments,
  salaryStructures,
  payrollRuns,
  payslips,
  payslipComponents,
} from "../database/schema";
import crypto from "node:crypto";
import { eq, and } from "drizzle-orm";

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
  console.log("🌱 Starting comprehensive database seeding...");
  const db = await connectDB();

  try {
    // -------------------------------------------------------------
    // 1. Seed Permissions
    // -------------------------------------------------------------
    console.log("1️⃣  Seeding permissions...");
    for (const perm of permissionCatalog) {
      await db
        .insert(permissions)
        .values(perm)
        .onConflictDoUpdate({
          target: permissions.code,
          set: { description: perm.description },
        });
    }

    // -------------------------------------------------------------
    // 2. Create Core Roles
    // -------------------------------------------------------------
    console.log("2️⃣  Creating core roles...");
    const roleValues = [
      { name: "Super Admin", description: "Full system access" },
      { name: "HR Manager", description: "Manage employees, departments and attendance" },
      { name: "Manager", description: "Manage team attendance, leaves and tasks" },
      { name: "Employee", description: "Standard employee access" },
    ];

    for (const roleVal of roleValues) {
      await db.insert(roles).values(roleVal).onConflictDoNothing();
    }

    const allRoles = await db.select().from(roles);
    const allPerms = await db.select().from(permissions);

    const getRoleId = (name: string) => allRoles.find((r: any) => r.name === name)?.id;
    const getPermId = (code: string) => allPerms.find((p: any) => p.code === code)?.id;

    // Map permissions to roles
    const hrManagerId = getRoleId("HR Manager");
    if (hrManagerId) {
      const hrPerms = [
        "employees.view", "employees.create", "employees.edit", "employees.delete",
        "departments.view", "departments.manage", "attendance.view", "attendance.mark",
        "attendance.export", "leaves.view_all", "leaves.approve", "leaves.manage",
        "payroll.view_all", "payroll.manage", "tasks.view_all", "tasks.assign",
        "holidays.view", "holidays.manage", "dashboard.view"
      ];
      for (const code of hrPerms) {
        const permId = getPermId(code);
        if (permId) {
          await db.insert(rolePermissions).values({ roleId: hrManagerId, permissionId: permId }).onConflictDoNothing();
        }
      }
    }

    const managerRoleId = getRoleId("Manager");
    if (managerRoleId) {
      const managerPerms = [
        "employees.view", "departments.view", "attendance.view", "attendance.mark",
        "leaves.view_own", "leaves.view_all", "leaves.apply", "leaves.approve",
        "payroll.view_own", "tasks.view_own", "tasks.view_all", "tasks.assign",
        "tasks.update", "tasks.comment", "holidays.view", "dashboard.view"
      ];
      for (const code of managerPerms) {
        const permId = getPermId(code);
        if (permId) {
          await db.insert(rolePermissions).values({ roleId: managerRoleId, permissionId: permId }).onConflictDoNothing();
        }
      }
    }

    const empRoleId = getRoleId("Employee");
    if (empRoleId) {
      const empPerms = [
        "employees.view", "attendance.view", "attendance.mark", "leaves.view_own",
        "leaves.apply", "payroll.view_own", "tasks.view_own", "tasks.update",
        "tasks.comment", "holidays.view"
      ];
      for (const code of empPerms) {
        const permId = getPermId(code);
        if (permId) {
          await db.insert(rolePermissions).values({ roleId: empRoleId, permissionId: permId }).onConflictDoNothing();
        }
      }
    }

    // -------------------------------------------------------------
    // 3. Seed Departments
    // -------------------------------------------------------------
    console.log("3️⃣  Seeding departments...");
    const departmentList = [
      { name: "Engineering", code: "ENG", description: "Software development and infrastructure" },
      { name: "Human Resources", code: "HR", description: "Talent acquisition, operations, and culture" },
      { name: "Product & Design", code: "PRD", description: "Product strategy and UI/UX design" },
      { name: "Sales & Marketing", code: "SLS", description: "Business growth and brand awareness" },
      { name: "Finance & Operations", code: "FIN", description: "Financial management and office ops" },
    ];

    for (const dept of departmentList) {
      await db.insert(departments).values(dept).onConflictDoNothing();
    }

    const dbDepartments = await db.select().from(departments);
    const getDeptId = (code: string) => dbDepartments.find((d: any) => d.code === code)?.id;

    // -------------------------------------------------------------
    // 4. Seed Users and Employees
    // -------------------------------------------------------------
    console.log("4️⃣  Seeding users and employee profiles...");
    const defaultPassword = hashPassword("Password123!");

    const userSeedData = [
      {
        email: "admin@harbor.hr",
        passwordHash: hashPassword("admin123"),
        roleName: "Super Admin",
        employeeCode: "EMP001",
        firstName: "Super",
        lastName: "Admin",
        dob: "1988-04-12",
        gender: "Male",
        phone: "+1-555-0101",
        officialEmail: "admin@harbor.hr",
        address1: "100 Tech HQ Way",
        city: "San Francisco",
        state: "CA",
        pincode: "94105",
        country: "USA",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        designation: "Chief Technology Officer",
        deptCode: "ENG",
        joiningDate: "2020-01-15",
        employmentType: "Full-Time",
        status: "Active",
      },
      {
        email: "hr@harbor.hr",
        passwordHash: defaultPassword,
        roleName: "HR Manager",
        employeeCode: "EMP002",
        firstName: "Eleanor",
        lastName: "Vance",
        dob: "1991-08-23",
        gender: "Female",
        phone: "+1-555-0102",
        officialEmail: "hr@harbor.hr",
        address1: "45 Palm Avenue",
        city: "San Francisco",
        state: "CA",
        pincode: "94107",
        country: "USA",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
        designation: "HR Director",
        deptCode: "HR",
        joiningDate: "2021-03-01",
        employmentType: "Full-Time",
        status: "Active",
      },
      {
        email: "manager@harbor.hr",
        passwordHash: defaultPassword,
        roleName: "Manager",
        employeeCode: "EMP003",
        firstName: "Marcus",
        lastName: "Brody",
        dob: "1987-11-05",
        gender: "Male",
        phone: "+1-555-0103",
        officialEmail: "manager@harbor.hr",
        address1: "782 Market Street",
        city: "San Francisco",
        state: "CA",
        pincode: "94103",
        country: "USA",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        designation: "Engineering Lead",
        deptCode: "ENG",
        joiningDate: "2021-06-15",
        employmentType: "Full-Time",
        status: "Active",
      },
      {
        email: "john.doe@harbor.hr",
        passwordHash: defaultPassword,
        roleName: "Employee",
        employeeCode: "EMP004",
        firstName: "John",
        lastName: "Doe",
        dob: "1994-02-17",
        gender: "Male",
        phone: "+1-555-0104",
        officialEmail: "john.doe@harbor.hr",
        address1: "123 Mission St",
        city: "Oakland",
        state: "CA",
        pincode: "94612",
        country: "USA",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
        designation: "Senior Software Engineer",
        deptCode: "ENG",
        joiningDate: "2022-02-10",
        employmentType: "Full-Time",
        status: "Active",
      },
      {
        email: "jane.smith@harbor.hr",
        passwordHash: defaultPassword,
        roleName: "Employee",
        employeeCode: "EMP005",
        firstName: "Jane",
        lastName: "Smith",
        dob: "1996-09-30",
        gender: "Female",
        phone: "+1-555-0105",
        officialEmail: "jane.smith@harbor.hr",
        address1: "889 Valencia St",
        city: "San Francisco",
        state: "CA",
        pincode: "94110",
        country: "USA",
        photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
        designation: "Lead UX Designer",
        deptCode: "PRD",
        joiningDate: "2022-08-01",
        employmentType: "Full-Time",
        status: "Active",
      },
      {
        email: "alex.wong@harbor.hr",
        passwordHash: defaultPassword,
        roleName: "Employee",
        employeeCode: "EMP006",
        firstName: "Alex",
        lastName: "Wong",
        dob: "1993-05-14",
        gender: "Non-binary",
        phone: "+1-555-0106",
        officialEmail: "alex.wong@harbor.hr",
        address1: "404 Geary Blvd",
        city: "San Francisco",
        state: "CA",
        pincode: "94102",
        country: "USA",
        photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
        designation: "Senior Account Executive",
        deptCode: "SLS",
        joiningDate: "2023-01-16",
        employmentType: "Full-Time",
        status: "Active",
      },
    ];

    const insertedEmployeesMap = new Map<string, any>();

    for (const uData of userSeedData) {
      const roleId = getRoleId(uData.roleName);
      
      // Upsert User
      const [uRecord] = await db
        .insert(users)
        .values({
          email: uData.email,
          passwordHash: uData.passwordHash,
          roleId: roleId,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: users.email,
          set: { roleId: roleId, updatedAt: new Date() },
        })
        .returning();

      if (uRecord && roleId) {
        await db
          .insert(userRoles)
          .values({ userId: uRecord.id, roleId: roleId })
          .onConflictDoNothing();
      }

      // Upsert Employee
      const deptId = getDeptId(uData.deptCode)!;

      const existingEmp = await db
        .select()
        .from(employees)
        .where(eq(employees.userId, uRecord.id));

      let empRecord;
      if (existingEmp.length > 0) {
        empRecord = existingEmp[0];
      } else {
        [empRecord] = await db
          .insert(employees)
          .values({
            userId: uRecord.id,
            employeeCode: uData.employeeCode,
            firstName: uData.firstName,
            lastName: uData.lastName,
            dob: uData.dob,
            gender: uData.gender,
            phone: uData.phone,
            emailOfficial: uData.officialEmail,
            addressLine1: uData.address1,
            city: uData.city,
            state: uData.state,
            pincode: uData.pincode,
            country: uData.country,
            photoUrl: uData.photoUrl,
            designation: uData.designation,
            departmentId: deptId,
            joiningDate: uData.joiningDate,
            employmentType: uData.employmentType,
            status: uData.status,
          })
          .returning();
      }

      insertedEmployeesMap.set(uData.email, empRecord);
    }

    // Set Manager relationships
    const marcusEmp = insertedEmployeesMap.get("manager@harbor.hr");
    const johnEmp = insertedEmployeesMap.get("john.doe@harbor.hr");
    const janeEmp = insertedEmployeesMap.get("jane.smith@harbor.hr");

    if (marcusEmp && johnEmp) {
      await db
        .update(employees)
        .set({ managerEmployeeId: marcusEmp.id })
        .where(eq(employees.id, johnEmp.id));
    }
    if (marcusEmp && janeEmp) {
      await db
        .update(employees)
        .set({ managerEmployeeId: marcusEmp.id })
        .where(eq(employees.id, janeEmp.id));
    }

    // -------------------------------------------------------------
    // 5. Seed Leave Types & Leave Balances
    // -------------------------------------------------------------
    console.log("5️⃣  Seeding leave types & balances...");
    const leaveTypesList = [
      { code: "CL", name: "Casual Leave", annualQuota: 12, maxCarryForward: 3, encashable: false, requiresApprovalBy: "MANAGER" },
      { code: "SL", name: "Sick Leave", annualQuota: 10, maxCarryForward: 0, encashable: false, requiresApprovalBy: "MANAGER" },
      { code: "PL", name: "Paid Leave (Earned)", annualQuota: 18, maxCarryForward: 10, encashable: true, requiresApprovalBy: "HR" },
      { code: "ML", name: "Maternity/Paternity Leave", annualQuota: 84, maxCarryForward: 0, encashable: false, requiresApprovalBy: "HR" },
    ];

    for (const lt of leaveTypesList) {
      await db.insert(leaveTypes).values(lt).onConflictDoNothing();
    }

    const dbLeaveTypes = await db.select().from(leaveTypes);
    const getLeaveTypeId = (code: string) => dbLeaveTypes.find((l: any) => l.code === code)?.id;

    const currentYear = new Date().getFullYear();
    for (const [email, empObj] of insertedEmployeesMap.entries()) {
      for (const lt of dbLeaveTypes) {
        const existingBalance = await db
          .select()
          .from(leaveBalances)
          .where(
            and(
              eq(leaveBalances.employeeId, empObj.id),
              eq(leaveBalances.leaveTypeId, lt.id),
              eq(leaveBalances.year, currentYear)
            )
          );

        if (existingBalance.length === 0) {
          const opening = lt.annualQuota;
          const availed = Math.floor(Math.random() * 4);
          await db.insert(leaveBalances).values({
            employeeId: empObj.id,
            leaveTypeId: lt.id,
            year: currentYear,
            openingBalance: opening,
            accrued: opening,
            availed: availed,
            closingBalance: opening - availed,
          });
        }
      }
    }

    // -------------------------------------------------------------
    // 6. Seed Holidays
    // -------------------------------------------------------------
    console.log("6️⃣  Seeding holiday calendar...");
    const holidaysList = [
      { date: `${currentYear}-01-01`, name: "New Year's Day", type: "National", location: "All" },
      { date: `${currentYear}-05-25`, name: "Memorial Day", type: "National", location: "All" },
      { date: `${currentYear}-07-04`, name: "Independence Day", type: "National", location: "All" },
      { date: `${currentYear}-09-07`, name: "Labor Day", type: "National", location: "All" },
      { date: `${currentYear}-11-26`, name: "Thanksgiving Day", type: "National", location: "All" },
      { date: `${currentYear}-12-25`, name: "Christmas Day", type: "National", location: "All" },
    ];

    for (const hol of holidaysList) {
      await db.insert(holidays).values(hol).onConflictDoNothing();
    }

    // -------------------------------------------------------------
    // 7. Seed Attendance Records (Past 14 Days including Today)
    // -------------------------------------------------------------
    console.log("7️⃣  Seeding recent attendance records...");
    const today = new Date();
    for (let i = 0; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

      if (isWeekend) continue;

      for (const [email, empObj] of insertedEmployeesMap.entries()) {
        const existingAtt = await db
          .select()
          .from(attendanceRecords)
          .where(
            and(
              eq(attendanceRecords.employeeId, empObj.id),
              eq(attendanceRecords.date, dateStr)
            )
          );

        if (existingAtt.length === 0) {
          const rand = Math.random();
          let status = "PRESENT";
          if (rand < 0.15) status = "LATE";
          else if (rand < 0.25) status = "ABSENT";

          let checkInHour = status === "LATE" ? 10 : 9;
          let checkIn = new Date(d);
          checkIn.setHours(checkInHour, Math.floor(Math.random() * 30), 0);

          let checkOut = new Date(d);
          checkOut.setHours(17, Math.floor(Math.random() * 45), 0);

          await db.insert(attendanceRecords).values({
            employeeId: empObj.id,
            date: dateStr,
            status: status,
            checkInTime: status === "ABSENT" ? null : checkIn,
            checkOutTime: status === "ABSENT" ? null : checkOut,
            workHours: status === "ABSENT" ? 0 : 8.0,
            remarks: status === "ABSENT" ? "Personal leave / sick day" : status === "LATE" ? "Traffic delay" : "Regular check-in",
          });
        }
      }
    }

    // -------------------------------------------------------------
    // 8. Seed Leave Requests
    // -------------------------------------------------------------
    console.log("8️⃣  Seeding sample leave requests...");
    const clTypeId = getLeaveTypeId("CL");
    const slTypeId = getLeaveTypeId("SL");
    const plTypeId = getLeaveTypeId("PL");
    const mlTypeId = getLeaveTypeId("ML");

    const johnEmpObj = insertedEmployeesMap.get("john.doe@harbor.hr");
    const janeEmpObj = insertedEmployeesMap.get("jane.smith@harbor.hr");
    const alexEmpObj = insertedEmployeesMap.get("alex.wong@harbor.hr");
    const marcusEmpObj = insertedEmployeesMap.get("manager@harbor.hr");
    const eleanorEmpObj = insertedEmployeesMap.get("hr@harbor.hr");

    const sampleLeaves = [
      { emp: johnEmpObj, type: clTypeId, start: "2026-08-22", end: "2026-08-23", days: 2, reason: "Family event", status: "PENDING" },
      { emp: janeEmpObj, type: slTypeId, start: "2026-08-20", end: "2026-08-21", days: 2, reason: "Doctor appointment & recovery", status: "PENDING" },
      { emp: alexEmpObj, type: plTypeId, start: "2026-09-01", end: "2026-09-05", days: 5, reason: "Annual family vacation", status: "PENDING" },
      { emp: johnEmpObj, type: mlTypeId, start: "2026-09-15", end: "2026-09-25", days: 10, reason: "Paternity leave", status: "PENDING" },
      { emp: eleanorEmpObj, type: clTypeId, start: "2026-08-25", end: "2026-08-26", days: 2, reason: "Personal emergency", status: "APPROVED" },
      { emp: marcusEmpObj, type: plTypeId, start: "2026-08-28", end: "2026-08-30", days: 3, reason: "Long weekend trip", status: "PENDING" },
    ];

    for (const item of sampleLeaves) {
      if (item.emp && item.type) {
        await db.insert(leaveRequests).values({
          employeeId: item.emp.id,
          leaveTypeId: item.type,
          startDate: item.start,
          endDate: item.end,
          days: item.days,
          reason: item.reason,
          status: item.status,
          appliedAt: new Date(),
          approverEmployeeId: marcusEmpObj ? marcusEmpObj.id : null,
        });
      }
    }

    // -------------------------------------------------------------
    // 9. Seed Tasks & Task Comments
    // -------------------------------------------------------------
    console.log("9️⃣  Seeding tasks and activity comments...");
    if (marcusEmpObj && johnEmpObj && janeEmpObj && alexEmpObj) {
      const taskList = [
        {
          title: "Implement OAuth2 Authentication Flow",
          desc: "Integrate Google & GitHub OAuth2 providers for user single sign-on.",
          assignedTo: johnEmpObj.id,
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: "2026-08-25",
        },
        {
          title: "Redesign Employee Dashboard Wireframes",
          desc: "Create responsive Figma component library and dashboard mockups.",
          assignedTo: janeEmpObj.id,
          status: "IN_PROGRESS",
          priority: "URGENT",
          dueDate: "2026-08-22",
        },
        {
          title: "Setup Automated CI/CD Pipeline for Microservices",
          desc: "Write GitHub Actions workflow scripts to run Jest unit tests and Docker image builds.",
          assignedTo: johnEmpObj.id,
          status: "TO_DO",
          priority: "MEDIUM",
          dueDate: "2026-08-28",
        },
        {
          title: "Q3 Sales Performance & Forecast Report",
          desc: "Compile revenue forecasts and market trend analysis for leadership meeting.",
          assignedTo: alexEmpObj.id,
          status: "IN_PROGRESS",
          priority: "HIGH",
          dueDate: "2026-08-24",
        },
        {
          title: "Audit Role-Based Access Control Permissions",
          desc: "Verify user permissions across security groups and departments.",
          assignedTo: janeEmpObj.id,
          status: "TO_DO",
          priority: "LOW",
          dueDate: "2026-08-30",
        },
      ];

      for (const t of taskList) {
        const [insertedTask] = await db.insert(tasks).values({
          title: t.title,
          description: t.desc,
          assignedByEmployeeId: marcusEmpObj.id,
          assignedToEmployeeId: t.assignedTo,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate,
        }).returning();

        if (insertedTask) {
          await db.insert(taskComments).values({
            taskId: insertedTask.id,
            employeeId: t.assignedTo,
            comment: "Started working on this task. Target completion on schedule.",
          });
        }
      }
    }

    // -------------------------------------------------------------
    // 10. Seed Salary Structures & Payroll Runs
    // -------------------------------------------------------------
    console.log("🔟 Seeding salary structures and payroll runs...");
    const salaryConfigs = [
      { email: "admin@harbor.hr", basic: 12000, hra: 5000, allowances: 3000 },
      { email: "hr@harbor.hr", basic: 9000, hra: 4000, allowances: 2000 },
      { email: "manager@harbor.hr", basic: 10000, hra: 4500, allowances: 2500 },
      { email: "john.doe@harbor.hr", basic: 7500, hra: 3000, allowances: 1500 },
      { email: "jane.smith@harbor.hr", basic: 7000, hra: 3000, allowances: 1500 },
      { email: "alex.wong@harbor.hr", basic: 6500, hra: 2800, allowances: 1200 },
    ];

    for (const sc of salaryConfigs) {
      const empObj = insertedEmployeesMap.get(sc.email);
      if (empObj) {
        await db
          .insert(salaryStructures)
          .values({
            employeeId: empObj.id,
            effectiveFrom: `${currentYear}-01-01`,
            basic: sc.basic,
            hra: sc.hra,
            otherAllowances: sc.allowances,
            otherEarnings: 500,
            pfApplicable: true,
            esiApplicable: false,
            tdsRatePercent: 10,
          })
          .onConflictDoNothing();
      }
    }

    // Seed previous month Payroll Run
    const prevMonthDate = new Date();
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    const pMonth = prevMonthDate.getMonth() + 1;
    const pYear = prevMonthDate.getFullYear();

    const superAdminUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin@harbor.hr"));

    if (superAdminUser.length > 0) {
      const [payrollRun] = await db
        .insert(payrollRuns)
        .values({
          month: pMonth,
          year: pYear,
          status: "COMPLETED",
          processedByUserId: superAdminUser[0].id,
          processedAt: new Date(),
        })
        .returning();

      if (payrollRun) {
        let pCount = 100;
        for (const [email, empObj] of insertedEmployeesMap.entries()) {
          pCount++;
          const gross = 12000;
          const pfEmp = 600;
          const pfEmpr = 600;
          const tds = 1000;
          const net = gross - pfEmp - tds;

          const [payslip] = await db
            .insert(payslips)
            .values({
              payrollRunId: payrollRun.id,
              employeeId: empObj.id,
              grossEarnings: gross,
              pfEmployee: pfEmp,
              pfEmployer: pfEmpr,
              esiEmployee: 0,
              esiEmployer: 0,
              tds: tds,
              otherDeductions: 0,
              netPay: net,
              payslipNumber: `PAY-${pYear}${pMonth.toString().padStart(2, "0")}-${pCount}`,
            })
            .onConflictDoNothing()
            .returning();

          if (payslip) {
            await db.insert(payslipComponents).values([
              { payslipId: payslip.id, type: "EARNING", code: "BASIC", label: "Basic Pay", amount: 7000 },
              { payslipId: payslip.id, type: "EARNING", code: "HRA", label: "House Rent Allowance", amount: 3500 },
              { payslipId: payslip.id, type: "EARNING", code: "SPECIAL", label: "Special Allowance", amount: 1500 },
              { payslipId: payslip.id, type: "DEDUCTION", code: "PF", label: "Provident Fund", amount: 600 },
              { payslipId: payslip.id, type: "DEDUCTION", code: "TDS", label: "Income Tax (TDS)", amount: 1000 },
            ]);
          }
        }
      }
    }

    console.log("\n==================================================");
    console.log("✅ Comprehensive Seeding Completed Successfully!");
    console.log("==================================================");
    console.log("🔑 Presentation Demo Accounts Credentials:");
    console.log("--------------------------------------------------");
    console.log("1. Super Admin   : admin@harbor.hr     | Password: admin123");
    console.log("2. HR Manager    : hr@harbor.hr        | Password: Password123!");
    console.log("3. Manager       : manager@harbor.hr   | Password: Password123!");
    console.log("4. Employee (Eng): john.doe@harbor.hr  | Password: Password123!");
    console.log("5. Employee (Des): jane.smith@harbor.hr | Password: Password123!");
    console.log("6. Employee (Sls): alex.wong@harbor.hr  | Password: Password123!");
    console.log("==================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
