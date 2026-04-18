import { Request, Response } from "express";
import connectDB from "../database/connection";
import { permissions } from "../database/schema";
import { eq, desc } from "drizzle-orm";

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const allPermissions = await db.select().from(permissions).orderBy(desc(permissions.code));
    res.status(200).json({ status: "success", data: allPermissions });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const db = await connectDB();
    const permission = await db.select().from(permissions).where(eq(permissions.id, id)).limit(1);

    if (permission.length === 0) {
      return res.status(404).json({ status: "error", message: "Permission not found" });
    }

    res.status(200).json({ status: "success", data: permission[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  const { code, description } = req.body;

  if (!code) {
    return res.status(400).json({ status: "error", message: "Permission code is required" });
  }

  try {
    const db = await connectDB();
    const newPermission = await db.insert(permissions).values({ code, description }).returning();
    res.status(201).json({ status: "success", data: newPermission[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ status: "error", message: "Permission code already exists" });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { code, description } = req.body;

  try {
    const db = await connectDB();
    const updatedPermission = await db.update(permissions)
      .set({ code, description })
      .where(eq(permissions.id, id))
      .returning();

    if (updatedPermission.length === 0) {
      return res.status(404).json({ status: "error", message: "Permission not found" });
    }

    res.status(200).json({ status: "success", data: updatedPermission[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const db = await connectDB();
    const deletedPermission = await db.delete(permissions).where(eq(permissions.id, id)).returning();

    if (deletedPermission.length === 0) {
      return res.status(404).json({ status: "error", message: "Permission not found" });
    }

    res.status(200).json({ status: "success", message: "Permission deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
