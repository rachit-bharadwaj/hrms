import { Request, Response } from "express";
import connectDB from "../database/connection";
import { holidays } from "../database/schema";
import { eq, asc } from "drizzle-orm";

export const getHolidays = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const result = await db.select().from(holidays).orderBy(asc(holidays.date));
    res.status(200).json({ status: "success", data: result });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const addHoliday = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const result = await db.insert(holidays).values(req.body).returning();
    res.status(201).json({ status: "success", data: result[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteHoliday = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const db = await connectDB();
    await db.delete(holidays).where(eq(holidays.id, id));
    res.status(200).json({ status: "success", message: "Holiday deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
