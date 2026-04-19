import { Request, Response } from "express";
import connectDB from "../database/connection";
import { roles, rolePermissions, permissions, users } from "../database/schema";
import { eq, desc } from "drizzle-orm";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const allRoles = await db.select().from(roles).orderBy(desc(roles.name));
    res.status(200).json({ status: "success", data: allRoles });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const db = await connectDB();
    const role = await db.select().from(roles).where(eq(roles.id, id)).limit(1);

    if (role.length === 0) {
      return res.status(404).json({ status: "error", message: "Role not found" });
    }

    // Optionally fetch associated permissions
    const associatedPermissions = await db.select({
      id: permissions.id,
      code: permissions.code,
      description: permissions.description
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, id));

    res.status(200).json({ 
      status: "success", 
      data: { ...role[0], permissions: associatedPermissions } 
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ status: "error", message: "Role name is required" });
  }

  try {
    const db = await connectDB();
    const newRole = await db.insert(roles).values({ name, description }).returning();
    res.status(201).json({ status: "success", data: newRole[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ status: "error", message: "Role name already exists" });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { name, description } = req.body;

  try {
    const db = await connectDB();
    const updatedRole = await db.update(roles)
      .set({ name, description })
      .where(eq(roles.id, id))
      .returning();

    if (updatedRole.length === 0) {
      return res.status(404).json({ status: "error", message: "Role not found" });
    }

    res.status(200).json({ status: "success", data: updatedRole[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  try {
    const db = await connectDB();

    // 1. Check if any users are assigned to this role
    const assignedUsers = await db.select().from(users).where(eq(users.roleId, id)).limit(1);
    if (assignedUsers.length > 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "Cannot delete role because it is currently assigned to one or more users. Please reassign the users first." 
      });
    }

    // 2. Delete associated role permissions first to satisfy foreign key constraints
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));

    // 3. Delete the role itself
    const deletedRole = await db.delete(roles).where(eq(roles.id, id)).returning();

    if (deletedRole.length === 0) {
      return res.status(404).json({ status: "error", message: "Role not found" });
    }

    res.status(200).json({ status: "success", message: "Role deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const assignPermissionToRole = async (req: Request, res: Response) => {
  const { roleId, permissionId } = req.body;

  if (!roleId || !permissionId) {
    return res.status(400).json({ status: "error", message: "roleId and permissionId are required" });
  }

  try {
    const db = await connectDB();
    const newAssignment = await db.insert(rolePermissions).values({ roleId, permissionId }).returning();
    res.status(201).json({ status: "success", data: newAssignment[0] });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
