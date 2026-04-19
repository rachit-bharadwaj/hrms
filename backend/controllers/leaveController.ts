import { Request, Response } from "express";
import connectDB from "../database/connection";
import { leaveRequests, leaveBalances, leaveTypes, employees } from "../database/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { AuthRequest } from "../middleware/authMiddleware";

export const getLeaveTypes = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const types = await db.select().from(leaveTypes);
    res.status(200).json({ status: "success", data: types });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const { leaveTypeId, startDate, endDate, days, reason } = req.body;
    const employeeId = req.user?.id; // This assumes req.user.id is the employee ID. 
    // Wait! In this system, user.id might be different from employee.id.
    // I should find the employee linked to this user.
    
    if (!employeeId) return res.status(401).json({ status: "error", message: "User not authenticated" });

    const db = await connectDB();
    
    // Find employee by user ID
    const employee = await db.select().from(employees).where(eq(employees.userId, employeeId)).limit(1);
    if (!employee[0]) return res.status(404).json({ status: "error", message: "Employee record not found" });

    const empId = employee[0].id;

    // Check balance
    const balance = await db
      .select()
      .from(leaveBalances)
      .where(
        and(
          eq(leaveBalances.employeeId, empId),
          eq(leaveBalances.leaveTypeId, leaveTypeId),
          eq(leaveBalances.year, new Date().getFullYear())
        )
      )
      .limit(1);

    if (!balance[0] || balance[0].closingBalance < days) {
      return res.status(400).json({ 
        status: "error", 
        message: `Insufficient leave balance. Available: ${balance[0]?.closingBalance || 0}` 
      });
    }

    const newRequest = await db
      .insert(leaveRequests)
      .values({
        employeeId: empId,
        leaveTypeId,
        startDate,
        endDate,
        days,
        reason,
        status: "PENDING",
      })
      .returning();

    res.status(201).json({ status: "success", data: newRequest[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getMyLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const db = await connectDB();
    const employee = await db.select().from(employees).where(eq(employees.userId, userId as string)).limit(1);
    if (!employee[0]) return res.status(404).json({ status: "error", message: "Employee not found" });

    const requests = await db
      .select({
        id: leaveRequests.id,
        startDate: leaveRequests.startDate,
        endDate: leaveRequests.endDate,
        days: leaveRequests.days,
        reason: leaveRequests.reason,
        status: leaveRequests.status,
        appliedAt: leaveRequests.appliedAt,
        leaveTypeName: leaveTypes.name,
      })
      .from(leaveRequests)
      .innerJoin(leaveTypes, eq(leaveRequests.leaveTypeId, leaveTypes.id))
      .where(eq(leaveRequests.employeeId, employee[0].id))
      .orderBy(desc(leaveRequests.appliedAt));

    res.status(200).json({ status: "success", data: requests });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getPendingLeaveRequests = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const requests = await db
      .select({
        id: leaveRequests.id,
        startDate: leaveRequests.startDate,
        endDate: leaveRequests.endDate,
        days: leaveRequests.days,
        reason: leaveRequests.reason,
        status: leaveRequests.status,
        appliedAt: leaveRequests.appliedAt,
        employeeName: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
        leaveTypeName: leaveTypes.name,
      })
      .from(leaveRequests)
      .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
      .innerJoin(leaveTypes, eq(leaveRequests.leaveTypeId, leaveTypes.id))
      .where(eq(leaveRequests.status, "PENDING"))
      .orderBy(desc(leaveRequests.appliedAt));

    res.status(200).json({ status: "success", data: requests });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { status, decisionRemarks } = req.body;
    const userId = req.user?.id;
    const db = await connectDB();

    const approver = await db.select().from(employees).where(eq(employees.userId, userId as string)).limit(1);
    
    // Get original request
    const request = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id)).limit(1);
    if (!request[0]) return res.status(404).json({ status: "error", message: "Request not found" });

    if (request[0].status !== "PENDING") {
      return res.status(400).json({ status: "error", message: "Request already processed" });
    }

    if (status === "APPROVED") {
      // Deduct from balance
      const balance = await db
        .select()
        .from(leaveBalances)
        .where(
          and(
            eq(leaveBalances.employeeId, request[0].employeeId),
            eq(leaveBalances.leaveTypeId, request[0].leaveTypeId),
            eq(leaveBalances.year, new Date(request[0].startDate).getFullYear())
          )
        )
        .limit(1);

      if (!balance[0] || balance[0].closingBalance < request[0].days) {
        return res.status(400).json({ status: "error", message: "Insufficient balance at time of approval" });
      }

      await db
        .update(leaveBalances)
        .set({
          availed: balance[0].availed + request[0].days,
          closingBalance: balance[0].closingBalance - request[0].days,
        })
        .where(eq(leaveBalances.id, balance[0].id));
    }

    const updated = await db
      .update(leaveRequests)
      .set({
        status,
        decisionRemarks,
        approverEmployeeId: approver[0]?.id,
        decisionAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(leaveRequests.id, id))
      .returning();

    res.status(200).json({ status: "success", data: updated[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getLeaveBalances = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const db = await connectDB();
    const employee = await db.select().from(employees).where(eq(employees.userId, userId as string)).limit(1);
    if (!employee[0]) return res.status(404).json({ status: "error", message: "Employee not found" });

    const balances = await db
      .select({
        leaveTypeName: leaveTypes.name,
        leaveTypeCode: leaveTypes.code,
        openingBalance: leaveBalances.openingBalance,
        accrued: leaveBalances.accrued,
        availed: leaveBalances.availed,
        closingBalance: leaveBalances.closingBalance,
      })
      .from(leaveBalances)
      .innerJoin(leaveTypes, eq(leaveBalances.leaveTypeId, leaveTypes.id))
      .where(and(eq(leaveBalances.employeeId, employee[0].id), eq(leaveBalances.year, new Date().getFullYear())));

    res.status(200).json({ status: "success", data: balances });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
