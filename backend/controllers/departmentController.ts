import { Request, Response } from "express";
import connectDB from "../database/connection";
import { departments } from "../database/schema";
import { eq } from "drizzle-orm";

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const result = await db.select().from(departments);
    res.status(200).json({ status: "success", data: result });
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
