import { Request, Response } from "express";
import connectDB from "../database/connection";
import { departments, employees } from "../database/schema";
import { eq, sql } from "drizzle-orm";

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    // Get departments with employee count
    const result = await db
      .select({
        id: departments.id,
        name: departments.name,
        code: departments.code,
        description: departments.description,
        createdAt: departments.createdAt,
        employeeCount: sql<number>`count(${employees.id})::int`,
      })
      .from(departments)
      .leftJoin(employees, eq(departments.id, employees.departmentId))
      .groupBy(departments.id);

    res.status(200).json({ status: "success", data: result });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const db = await connectDB();
    const result = await db
      .select()
      .from(departments)
      .where(eq(departments.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ status: "error", message: "Department not found" });
    }

    res.status(200).json({ status: "success", data: result[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const newDept = await db.insert(departments).values(req.body).returning();
    res.status(201).json({ status: "success", data: newDept[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const db = await connectDB();
    const updatedDept = await db
      .update(departments)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(departments.id, id))
      .returning();

    if (updatedDept.length === 0) {
      return res.status(404).json({ status: "error", message: "Department not found" });
    }

    res.status(200).json({ status: "success", data: updatedDept[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const db = await connectDB();
    
    // Check if department has employees
    const employeeCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(employees)
      .where(eq(employees.departmentId, id));

    if (employeeCount[0].count > 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "Cannot delete department with assigned employees. Reassign them first." 
      });
    }

    const deletedDept = await db
      .delete(departments)
      .where(eq(departments.id, id))
      .returning();

    if (deletedDept.length === 0) {
      return res.status(404).json({ status: "error", message: "Department not found" });
    }

    res.status(200).json({ status: "success", message: "Department deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getDepartmentStats = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const stats = await db
      .select({
        departmentName: departments.name,
        employeeCount: sql<number>`count(${employees.id})::int`,
      })
      .from(departments)
      .leftJoin(employees, eq(departments.id, employees.departmentId))
      .groupBy(departments.name);

    res.status(200).json({ status: "success", data: stats });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
