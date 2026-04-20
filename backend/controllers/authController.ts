import { Request, Response } from "express";
import connectDB from "../database/connection";
import { users, roles, userRoles, employees, departments, permissions, rolePermissions } from "../database/schema";
import { eq, inArray } from "drizzle-orm";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, FRONTEND_URL } from "../constants/config";
import { sendEmail } from "../utils/mailer";

const hashPassword = (password: string) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Email and password are required" });
  }

  try {
    const db = await connectDB();
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userResult.length === 0) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    const user = userResult[0];

    // Check password
    if (user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ status: "error", message: "Account is inactive. Please contact HR." });
    }

    // Fetch roles
    const userRoleResult = await db
      .select({ 
        roleId: userRoles.roleId,
        roleName: roles.name 
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id));
    
    const roleNames = userRoleResult.map((r: any) => r.roleName);
    const roleIds = userRoleResult.map((r: any) => r.roleId);

    // Resolve permissions for frontend UX
    let permissionCodes: string[] = [];
    if (roleNames.includes("Super Admin")) {
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

    // Update last login
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        mustChangePassword: user.mustChangePassword 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    const { passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      token,
      user: {
        ...userWithoutPassword,
        roles: roleNames,
        permissions: permissionCodes
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ status: "error", message: "Authentication required" });
  }

  try {
    const db = await connectDB();
    const userResult = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const employeeResult = await db.select().from(employees).where(eq(employees.userId, req.user.id)).limit(1);
    
    const { passwordHash, ...userWithoutPassword } = userResult[0];
    const employee = employeeResult.length > 0 ? employeeResult[0] : null;

    res.status(200).json({
      status: "success",
      user: {
        ...userWithoutPassword,
        name: employee ? `${employee.firstName} ${employee.lastName}` : "User",
        avatar: employee?.photoUrl || null,
        designation: employee?.designation || null,
        roles: req.user.roles,
        permissions: req.user.permissions
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  const { name, email, dob, phone, address } = req.body;
  const userId = req.user.id;

  try {
    const db = await connectDB();
    
    // Update user table
    if (email) {
      await db.update(users).set({ email, updatedAt: new Date() }).where(eq(users.id, userId));
    }

    // Update employee table
    const updatePayload: any = { updatedAt: new Date() };
    if (name) {
      const parts = name.trim().split(" ");
      updatePayload.firstName = parts[0];
      updatePayload.lastName = parts.slice(1).join(" ") || "";
    }
    if (dob) updatePayload.dob = dob;
    if (phone) updatePayload.phone = phone;
    if (address) updatePayload.addressLine1 = address;

    await db.update(employees).set(updatePayload).where(eq(employees.userId, userId));

    res.status(200).json({ status: "success", message: "Profile updated successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const changePassword = async (req: any, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ status: "error", message: "Current and new password are required" });
  }

  try {
    const db = await connectDB();
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (userResult.length === 0) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    if (userResult[0].passwordHash !== hashPassword(currentPassword)) {
      return res.status(401).json({ status: "error", message: "Incorrect current password" });
    }

    await db.update(users).set({ 
      passwordHash: hashPassword(newPassword), 
      mustChangePassword: false,
      updatedAt: new Date() 
    }).where(eq(users.id, userId));

    res.status(200).json({ status: "success", message: "Password changed successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: "error", message: "Email is required" });
  }

  try {
    const db = await connectDB();
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userResult.length === 0) {
      // For security reasons, don't reveal if user exists
      return res.status(200).json({ 
        status: "success", 
        message: "If an account with that email exists, a reset link has been sent." 
      });
    }

    const user = userResult[0];
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await db.update(users)
      .set({ 
        resetPasswordToken: resetToken, 
        resetPasswordExpires: resetTokenExpires 
      })
      .where(eq(users.id, user.id));

    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const emailResult = await sendEmail(
      user.email,
      "Password Reset Request - Harbor HRMS",
      `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">Password Reset</h2>
        <p style="color: #475569; line-height: 1.6;">You requested a password reset for your Harbor HRMS account.</p>
        <p style="color: #475569; line-height: 1.6;">Click the button below to reset your password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">Harbor HRMS — The complete workforce solution.</p>
      </div>
      `
    );

    if (!emailResult.success) {
      throw new Error("Failed to send reset email");
    }

    res.status(200).json({ 
      status: "success", 
      message: "If an account with that email exists, a reset link has been sent." 
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ status: "error", message: "Token and new password are required" });
  }

  try {
    const db = await connectDB();
    const userResult = await db.select().from(users)
      .where(eq(users.resetPasswordToken, token))
      .limit(1);

    if (userResult.length === 0) {
      return res.status(400).json({ status: "error", message: "Invalid or expired token" });
    }

    const user = userResult[0];

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ status: "error", message: "Token has expired" });
    }

    await db.update(users)
      .set({ 
        passwordHash: hashPassword(newPassword),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    res.status(200).json({ status: "success", message: "Password reset successful" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

