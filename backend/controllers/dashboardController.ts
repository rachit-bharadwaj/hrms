import { Request, Response } from "express";
import connectDB from "../database/connection";
import { employees, departments, attendanceRecords, leaveRequests, tasks, leaveTypes } from "../database/schema";
import { eq, and, sql, desc, count, between, gte } from "drizzle-orm";

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const today = new Date().toISOString().split("T")[0];

    // 1. Total Employees
    const totalEmployeesCount = await db.select({ value: count(employees.id) }).from(employees);
    
    // 2. Total Departments
    const totalDepartmentsCount = await db.select({ value: count(departments.id) }).from(departments);

    // 3. Attendance Today
    const attendanceToday = await db
      .select({
        status: attendanceRecords.status,
        count: sql<number>`count(*)::int`,
      })
      .from(attendanceRecords)
      .where(eq(attendanceRecords.date, today))
      .groupBy(attendanceRecords.status);

    const presentToday = attendanceToday.find((a: any) => a.status === "Present")?.count || 0;

    // 4. Pending Leave Requests
    const pendingLeavesCount = await db
      .select({ value: count(leaveRequests.id) })
      .from(leaveRequests)
      .where(eq(leaveRequests.status, "PENDING"));

    // 5. Active Tasks
    const activeTasksCount = await db
      .select({ value: count(tasks.id) })
      .from(tasks)
      .where(eq(tasks.status, "IN_PROGRESS"));

    // 6. Attendance Trend (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const attendanceTrend = await db
      .select({
        date: attendanceRecords.date,
        present: sql<number>`count(case when ${attendanceRecords.status} = 'Present' then 1 end)::int`,
        absent: sql<number>`count(case when ${attendanceRecords.status} = 'Absent' then 1 end)::int`,
      })
      .from(attendanceRecords)
      .where(gte(attendanceRecords.date, thirtyDaysAgoStr))
      .groupBy(attendanceRecords.date)
      .orderBy(attendanceRecords.date);

    // 7. Leave Type Distribution
    const leaveDistribution = await db
      .select({
        name: leaveTypes.name,
        count: sql<number>`count(${leaveRequests.id})::int`,
      })
      .from(leaveTypes)
      .leftJoin(leaveRequests, eq(leaveTypes.id, leaveRequests.leaveTypeId))
      .groupBy(leaveTypes.id, leaveTypes.name);

    // 8. Latest Pending Leave Requests
    const latestPendingLeaves = await db
      .select({
        id: leaveRequests.id,
        employeeName: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
        employeePhoto: employees.photoUrl,
        leaveType: leaveTypes.name,
        startDate: leaveRequests.startDate,
        endDate: leaveRequests.endDate,
        days: leaveRequests.days,
        status: leaveRequests.status,
      })
      .from(leaveRequests)
      .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
      .innerJoin(leaveTypes, eq(leaveRequests.leaveTypeId, leaveTypes.id))
      .where(eq(leaveRequests.status, "PENDING"))
      .orderBy(desc(leaveRequests.appliedAt))
      .limit(5);

    // 9. Upcoming Tasks
    const upcomingTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        dueDate: tasks.dueDate,
        status: tasks.status,
        employeeName: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
        employeePhoto: employees.photoUrl,
      })
      .from(tasks)
      .innerJoin(employees, eq(tasks.assignedToEmployeeId, employees.id))
      .where(eq(tasks.status, "PENDING")) // Show pending tasks as upcoming
      .orderBy(tasks.dueDate)
      .limit(6);

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalEmployees: totalEmployeesCount[0].value,
          totalDepartments: totalDepartmentsCount[0].value,
          presentToday,
          pendingLeaves: pendingLeavesCount[0].value,
          activeTasks: activeTasksCount[0].value,
        },
        attendanceTrend,
        leaveDistribution,
        latestPendingLeaves,
        upcomingTasks,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
