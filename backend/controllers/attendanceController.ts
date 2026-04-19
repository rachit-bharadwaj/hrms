import { Request, Response } from "express";
import connectDB from "../database/connection";
import { attendanceRecords, employees, departments, holidays } from "../database/schema";
import { eq, and, between, sql, desc, inArray } from "drizzle-orm";

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId, date, status, checkInTime, checkOutTime, remarks } = req.body;
    const db = await connectDB();

    // Check if record exists
    const existing = await db
      .select()
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.employeeId, employeeId),
          eq(attendanceRecords.date, date)
        )
      )
      .limit(1);

    let result;
    if (existing.length > 0) {
      result = await db
        .update(attendanceRecords)
        .set({
          status,
          checkInTime: checkInTime ? new Date(checkInTime) : undefined,
          checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
          remarks,
          updatedAt: new Date(),
        })
        .where(eq(attendanceRecords.id, existing[0].id))
        .returning();
    } else {
      result = await db
        .insert(attendanceRecords)
        .values({
          employeeId,
          date,
          status,
          checkInTime: checkInTime ? new Date(checkInTime) : undefined,
          checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined,
          remarks,
        })
        .returning();
    }

    res.status(200).json({ status: "success", data: result[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const bulkMarkAttendance = async (req: Request, res: Response) => {
  try {
    const { records } = req.body; // Array of { employeeId, date, status }
    const db = await connectDB();

    const results = [];
    for (const record of records) {
      const existing = await db
        .select()
        .from(attendanceRecords)
        .where(
          and(
            eq(attendanceRecords.employeeId, record.employeeId),
            eq(attendanceRecords.date, record.date)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        const updated = await db
          .update(attendanceRecords)
          .set({ status: record.status, updatedAt: new Date() })
          .where(eq(attendanceRecords.id, existing[0].id))
          .returning();
        results.push(updated[0]);
      } else {
        const inserted = await db
          .insert(attendanceRecords)
          .values({
            employeeId: record.employeeId,
            date: record.date,
            status: record.status,
          })
          .returning();
        results.push(inserted[0]);
      }
    }

    res.status(200).json({ status: "success", data: results });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getAttendanceByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.query as { date: string };
    const db = await connectDB();

    const allEmployees = await db.select().from(employees);
    const attendance = await db
      .select()
      .from(attendanceRecords)
      .where(eq(attendanceRecords.date, date));

    const holiday = await db
      .select()
      .from(holidays)
      .where(eq(holidays.date, date))
      .limit(1);

    const data = allEmployees.map((emp: any) => {
      const record = attendance.find((a: any) => a.employeeId === emp.id);
      let status = record ? record.status : "Not Marked";
      if (!record && holiday[0]) status = `Holiday: ${holiday[0].name}`;
      
      return {
        ...emp,
        attendanceStatus: status,
        attendanceId: record ? record.id : null,
        isHoliday: !!holiday[0]
      };
    });

    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getEmployeeMonthlyReport = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params as { employeeId: string };
    const { month, year } = req.query as { month: string; year: string };
    const db = await connectDB();

    const startDate = `${year}-${month.padStart(2, "0")}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month.padStart(2, "0")}-${lastDay}`;

    const records = await db
      .select()
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.employeeId, employeeId),
          between(attendanceRecords.date, startDate, endDate)
        )
      )
      .orderBy(attendanceRecords.date);

    res.status(200).json({ status: "success", data: records });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getDepartmentAttendanceSummary = async (req: Request, res: Response) => {
  try {
    const { date } = req.query as { date: string };
    const db = await connectDB();

    const result = await db
      .select({
        departmentName: departments.name,
        present: sql<number>`count(case when ${attendanceRecords.status} = 'Present' then 1 end)::int`,
        absent: sql<number>`count(case when ${attendanceRecords.status} = 'Absent' then 1 end)::int`,
        halfDay: sql<number>`count(case when ${attendanceRecords.status} = 'Half Day' then 1 end)::int`,
        wfh: sql<number>`count(case when ${attendanceRecords.status} = 'WFH' then 1 end)::int`,
        total: sql<number>`count(${employees.id})::int`,
      })
      .from(departments)
      .leftJoin(employees, eq(departments.id, employees.departmentId))
      .leftJoin(
        attendanceRecords,
        and(
          eq(employees.id, attendanceRecords.employeeId),
          eq(attendanceRecords.date, date)
        )
      )
      .groupBy(departments.id, departments.name);

    res.status(200).json({ status: "success", data: result });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const exportAttendanceCSV = async (req: Request, res: Response) => {
  try {
    const { date } = req.query as { date: string };
    const db = await connectDB();

    const data = await db
      .select({
        employeeCode: employees.employeeCode,
        name: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
        department: departments.name,
        status: attendanceRecords.status,
      })
      .from(employees)
      .leftJoin(departments, eq(employees.departmentId, departments.id))
      .leftJoin(
        attendanceRecords,
        and(
          eq(employees.id, attendanceRecords.employeeId),
          eq(attendanceRecords.date, date)
        )
      );

    let csv = "Employee Code,Name,Department,Status\n";
    data.forEach((row: any) => {
      csv += `${row.employeeCode},${row.name},${row.department},${row.status || "Not Marked"}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment(`attendance_${date}.csv`);
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
