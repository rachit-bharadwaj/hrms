import { Request, Response } from "express";
import connectDB from "../database/connection";
import { employees, departments, users } from "../database/schema";
import { eq, desc } from "drizzle-orm";

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const result = await db
      .select({
        id: employees.id,
        userId: employees.userId,
        firstName: employees.firstName,
        lastName: employees.lastName,
        employeeCode: employees.employeeCode,
        dob: employees.dob,
        gender: employees.gender,
        phone: employees.phone,
        emailOfficial: employees.emailOfficial,
        addressLine1: employees.addressLine1,
        addressLine2: employees.addressLine2,
        city: employees.city,
        state: employees.state,
        pincode: employees.pincode,
        country: employees.country,
        photoUrl: employees.photoUrl,
        designation: employees.designation,
        departmentId: employees.departmentId,
        departmentName: departments.name,
        joiningDate: employees.joiningDate,
        employmentType: employees.employmentType,
        status: employees.status,
      })
      .from(employees)
      .leftJoin(departments, eq(employees.departmentId, departments.id))
      .orderBy(desc(employees.createdAt));

    res.status(200).json({ status: "success", data: result });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const db = await connectDB();
    const result = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ status: "error", message: "Employee not found" });
    }

    res.status(200).json({ status: "success", data: result[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const newEmployee = await db.insert(employees).values(req.body).returning();
    res.status(201).json({ status: "success", data: newEmployee[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const { 
      id: _id, 
      createdAt: _createdAt, 
      updatedAt: _updatedAt, 
      departmentName: _departmentName,
      ...updateData 
    } = req.body;
    
    const db = await connectDB();
    const updatedEmployee = await db
      .update(employees)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();

    if (updatedEmployee.length === 0) {
      return res.status(404).json({ status: "error", message: "Employee not found" });
    }

    res.status(200).json({ status: "success", data: updatedEmployee[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const db = await connectDB();
    const deleted = await db.delete(employees).where(eq(employees.id, id)).returning();

    if (deleted.length === 0) {
      return res.status(404).json({ status: "error", message: "Employee not found" });
    }

    res.status(200).json({ status: "success", message: "Employee deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
