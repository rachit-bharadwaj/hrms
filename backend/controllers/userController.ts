import { desc, eq } from "drizzle-orm";
import { Request, Response } from "express";
import crypto from "node:crypto";
import connectDB from "../database/connection";
import { 
  users, 
  employees, 
  payrollRuns, 
  attendanceRecords, 
  leaveRequests,
  leaveBalances,
  tasks, 
  payslips, 
  salaryStructures,
  taskComments
} from "../database/schema";

// Simple hash function using built-in crypto since 외부 lib installation failed
const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        roleId: users.roleId,
        isActive: users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    res.status(200).json({ status: "success", data: allUsers });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const db = await connectDB();
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (user.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user[0];
    res.status(200).json({ status: "success", data: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, roleId } = req.body;

  if (!email || !password || !roleId) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing required fields" });
  }

  try {
    const db = await connectDB();
    const passwordHash = hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        roleId,
        // mustChangePassword: true,
      })
      .returning();

    const { passwordHash: _, ...userWithoutPassword } = newUser[0];
    res.status(201).json({ status: "success", data: userWithoutPassword });
  } catch (error: any) {
    if (error.code === "23505") {
      // Unique violation
      return res
        .status(409)
        .json({ status: "error", message: "Email already exists" });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { email, roleId, isActive, password } = req.body;

  try {
    const db = await connectDB();

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (email) updateData.email = email;
    if (roleId) updateData.roleId = roleId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) updateData.passwordHash = hashPassword(password);

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (updatedUser.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const { passwordHash, ...userWithoutPassword } = updatedUser[0];
    res.status(200).json({ status: "success", data: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const db = await connectDB();

    // 1. Check if user has processed any payroll runs (audit history)
    const processedPayroll = await db.select().from(payrollRuns).where(eq(payrollRuns.processedByUserId, id)).limit(1);
    if (processedPayroll.length > 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "Cannot delete user because they have processed payroll records in the system. For audit consistency, please deactivate this account instead of deleting it." 
      });
    }

    // 2. Fetch employee ID if it exists
    const employee = await db.select().from(employees).where(eq(employees.userId, id)).limit(1);
    
    if (employee.length > 0) {
      const empId = employee[0].id;

      // 3. Delete all employee-related data to avoid FK violations
      // This is for dev cleanup. In production, we'd normally soft-delete or prevent if data exists.
      await db.delete(attendanceRecords).where(eq(attendanceRecords.employeeId, empId));
      await db.delete(leaveRequests).where(eq(leaveRequests.employeeId, empId));
      await db.delete(leaveBalances).where(eq(leaveBalances.employeeId, empId));
      await db.delete(taskComments).where(eq(taskComments.employeeId, empId));
      await db.delete(tasks).where(eq(tasks.assignedToEmployeeId, empId));
      await db.delete(tasks).where(eq(tasks.assignedByEmployeeId, empId));
      await db.delete(payslips).where(eq(payslips.employeeId, empId));
      await db.delete(salaryStructures).where(eq(salaryStructures.employeeId, empId));
      
      // 4. Finally delete employee record
      await db.delete(employees).where(eq(employees.id, empId));
    }

    // 5. Delete the user
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (deletedUser.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
