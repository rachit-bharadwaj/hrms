import { Request, Response } from "express";
import connectDB from "../database/connection";
import { salaryStructures, payrollRuns, payslips, employees, users, departments, attendanceRecords } from "../database/schema";
import { eq, and, desc, sql, between } from "drizzle-orm";
import { AuthRequest } from "../middleware/authMiddleware";

export const getSalaryStructure = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params as { employeeId: string };
    const db = await connectDB();
    const result = await db.select().from(salaryStructures).where(eq(salaryStructures.employeeId, employeeId)).limit(1);
    res.status(200).json({ status: "success", data: result[0] || null });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateSalaryStructure = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params as { employeeId: string };
    const db = await connectDB();
    
    const existing = await db.select().from(salaryStructures).where(eq(salaryStructures.employeeId, employeeId)).limit(1);
    
    let result;
    if (existing.length > 0) {
      result = await db
        .update(salaryStructures)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(salaryStructures.employeeId, employeeId))
        .returning();
    } else {
      result = await db
        .insert(salaryStructures)
        .values({ ...req.body, employeeId })
        .returning();
    }
    
    res.status(200).json({ status: "success", data: result[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const processPayroll = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.body;
    const processedByUserId = req.user?.id;
    const db = await connectDB();

    // 1. Create a Payroll Run
    const newRun = await db.insert(payrollRuns).values({
      month,
      year,
      status: "COMPLETED",
      processedByUserId: processedByUserId as string,
      processedAt: new Date(),
    }).returning();

    const payrollRunId = newRun[0].id;

    // 2. Fetch all employees with salary structures
    const activeEmployees = await db
      .select({
        employeeId: employees.id,
        basic: salaryStructures.basic,
        hra: salaryStructures.hra,
        otherAllowances: salaryStructures.otherAllowances,
        otherEarnings: salaryStructures.otherEarnings,
        pfApplicable: salaryStructures.pfApplicable,
        esiApplicable: salaryStructures.esiApplicable,
        tdsRatePercent: salaryStructures.tdsRatePercent,
        firstName: employees.firstName,
        lastName: employees.lastName,
        employeeCode: employees.employeeCode,
      })
      .from(employees)
      .innerJoin(salaryStructures, eq(employees.id, salaryStructures.employeeId))
      .where(eq(employees.status, "Active"));

    const generatedPayslips = [];

    // 3. Process each employee
    for (const emp of activeEmployees) {
      const grossEarnings = emp.basic + emp.hra + emp.otherAllowances + (emp.otherEarnings || 0);
      
      // Calculate LWP (Leave Without Pay) pro-rata
      const totalDaysInMonth = new Date(year, month, 0).getDate();
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-${totalDaysInMonth}`;

      const absentRecords = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(attendanceRecords)
        .where(
          and(
            eq(attendanceRecords.employeeId, emp.employeeId),
            eq(attendanceRecords.status, "Absent"),
            between(attendanceRecords.date, startDate, endDate)
          )
        );

      const lwpDays = absentRecords[0].count;
      const dailyRate = grossEarnings / totalDaysInMonth;
      const deductionForAbsence = Math.round(lwpDays * dailyRate);

      let pfEmployee = 0;
      let pfEmployer = 0;
      if (emp.pfApplicable) {
        pfEmployee = Math.round(emp.basic * 0.12);
        pfEmployer = Math.round(emp.basic * 0.12);
      }

      let esiEmployee = 0;
      let esiEmployer = 0;
      if (emp.esiApplicable && grossEarnings <= 21000) {
        esiEmployee = Math.round(grossEarnings * 0.0075);
        esiEmployer = Math.round(grossEarnings * 0.0325);
      }

      const tds = Math.round((grossEarnings * (emp.tdsRatePercent || 0)) / 100);
      const netPay = grossEarnings - pfEmployee - esiEmployee - tds - deductionForAbsence;

      const payslipNum = `PAY-${year}${month.toString().padStart(2, '0')}-${emp.employeeCode}`;

      const payslip = await db.insert(payslips).values({
        payrollRunId,
        employeeId: emp.employeeId,
        grossEarnings,
        pfEmployee,
        pfEmployer,
        esiEmployee,
        esiEmployer,
        tds,
        otherDeductions: deductionForAbsence,
        netPay,
        payslipNumber: payslipNum,
      }).returning();

      generatedPayslips.push(payslip[0]);
    }

    res.status(200).json({ status: "success", data: generatedPayslips });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getMyPayslips = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const db = await connectDB();
    const employee = await db.select().from(employees).where(eq(employees.userId, userId as string)).limit(1);
    if (!employee[0]) return res.status(404).json({ status: "error", message: "Employee record not found" });

    const results = await db
      .select({
        id: payslips.id,
        payslipNumber: payslips.payslipNumber,
        netPay: payslips.netPay,
        month: payrollRuns.month,
        year: payrollRuns.year,
        createdAt: payslips.createdAt,
      })
      .from(payslips)
      .innerJoin(payrollRuns, eq(payslips.payrollRunId, payrollRuns.id))
      .where(eq(payslips.employeeId, employee[0].id))
      .orderBy(desc(payslips.createdAt));

    res.status(200).json({ status: "success", data: results });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getPayslipDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const db = await connectDB();
    
    const result = await db
      .select({
        payslip: payslips,
        employee: employees,
        department: departments.name,
        month: payrollRuns.month,
        year: payrollRuns.year,
      })
      .from(payslips)
      .innerJoin(employees, eq(payslips.employeeId, employees.id))
      .innerJoin(payrollRuns, eq(payslips.payrollRunId, payrollRuns.id))
      .leftJoin(departments, eq(employees.departmentId, departments.id))
      .where(eq(payslips.id, id))
      .limit(1);

    if (!result[0]) return res.status(404).json({ status: "error", message: "Payslip not found" });

    res.status(200).json({ status: "success", data: result[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
