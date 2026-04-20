import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/config";
import connectDB from "../database/connection";
import { userRoles, roles, rolePermissions, permissions } from "../database/schema";
import { eq, inArray } from "drizzle-orm";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    return res.status(401).json({ status: "error", message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Load effective permissions from DB for dynamic RBAC
    const db = await connectDB();
    
    // 1. Get roles
    const userRoleRecords = await db
      .select({ 
        roleId: userRoles.roleId,
        roleName: roles.name 
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, decoded.id));
    
    const roleNames = userRoleRecords.map((r: any) => r.roleName);
    const roleIds = userRoleRecords.map((r: any) => r.roleId);
    
    let permissionCodes: string[] = [];
    
    if (roleNames.includes("Super Admin")) {
      // Super Admin gets all permissions
      const allPerms = await db.select({ code: permissions.code }).from(permissions);
      permissionCodes = allPerms.map((p: any) => p.code);
    } else if (roleIds.length > 0) {
      const perms = await db
        .select({ code: permissions.code })
        .from(permissions)
        .innerJoin(rolePermissions, eq(permissions.id, rolePermissions.permissionId))
        .where(inArray(rolePermissions.roleId, roleIds));
      permissionCodes = Array.from(new Set(perms.map((p: any) => p.code)));
    }

    req.user = {
      ...decoded,
      roles: roleNames,
      permissions: permissionCodes,
    };
    
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ status: "error", message: "Invalid or expired token" });
  }
};

export const authorize = (allowedPermissions: string | string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: "error", message: "Authentication required" });
    }

    // Super Admin override (redundant if permissions are fully seeded, but safe)
    if (req.user.roles.includes("Super Admin")) {
      return next();
    }

    const required = Array.isArray(allowedPermissions) ? allowedPermissions : [allowedPermissions];
    const hasPermission = required.some(p => req.user?.permissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({ 
        status: "error", 
        message: `Access denied: Missing required permission(s): ${required.filter(p => !req.user?.permissions.includes(p)).join(", ")}` 
      });
    }

    next();
  };
};
