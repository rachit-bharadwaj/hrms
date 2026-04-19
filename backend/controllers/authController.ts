import { Request, Response } from "express";
import connectDB from "../database/connection";
import { users, roles, employees, departments } from "../database/schema";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../constants/config";

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

    // Fetch role details
    const roleResult = await db.select().from(roles).where(eq(roles.id, user.roleId)).limit(1);
    const roleName = roleResult.length > 0 ? roleResult[0].name : "User";

    // Check password
    if (user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ status: "error", message: "Account is inactive. Please contact HR." });
    }

    // Update last login
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        roleId: user.roleId, 
        role: roleName,
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
      user: userWithoutPassword,
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
