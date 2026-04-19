import { Request, Response } from "express";
import connectDB from "../database/connection";
import { tasks, employees, taskComments } from "../database/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { AuthRequest } from "../middleware/authMiddleware";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, assignedToEmployeeId, priority, dueDate } = req.body;
    const userId = req.user?.id;
    const db = await connectDB();

    const creator = await db.select().from(employees).where(eq(employees.userId, userId as string)).limit(1);
    if (!creator[0]) return res.status(404).json({ status: "error", message: "Employee not found" });

    const newTask = await db.insert(tasks).values({
      title,
      description,
      assignedByEmployeeId: creator[0].id,
      assignedToEmployeeId,
      priority,
      dueDate,
    }).returning();

    res.status(201).json({ status: "success", data: newTask[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { type } = req.query as { type: "assigned_to" | "assigned_by" | "all" };
    const db = await connectDB();

    const employee = await db.select().from(employees).where(eq(employees.userId, userId as string)).limit(1);
    if (!employee[0]) return res.status(404).json({ status: "error", message: "Employee not found" });

    let query = db.select({
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
      createdAt: tasks.createdAt,
      assignedToName: sql<string>`concat(e1.first_name, ' ', e1.last_name)`,
      assignedByName: sql<string>`concat(e2.first_name, ' ', e2.last_name)`,
    }).from(tasks)
    .leftJoin(sql`employees e1`, eq(tasks.assignedToEmployeeId, sql`e1.id`))
    .leftJoin(sql`employees e2`, eq(tasks.assignedByEmployeeId, sql`e2.id`));

    if (type === "assigned_to") {
      query.where(eq(tasks.assignedToEmployeeId, employee[0].id));
    } else if (type === "assigned_by") {
      query.where(eq(tasks.assignedByEmployeeId, employee[0].id));
    }

    const result = await query.orderBy(desc(tasks.createdAt));
    res.status(200).json({ status: "success", data: result });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const db = await connectDB();
    const updated = await db.update(tasks).set({ ...req.body, updatedAt: new Date() }).where(eq(tasks.id, id)).returning();
    res.status(200).json({ status: "success", data: updated[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const addTaskComment = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId, comment } = req.body;
    const userId = req.user?.id;
    const db = await connectDB();

    const employee = await db.select().from(employees).where(eq(employees.userId, userId as string)).limit(1);
    const newComment = await db.insert(taskComments).values({
      taskId,
      employeeId: employee[0].id,
      comment,
    }).returning();

    res.status(201).json({ status: "success", data: newComment[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
