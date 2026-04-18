import { Request, Response } from "express";
import connectDB from "../database/connection";
import { users } from "../database/schema";
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
      { id: user.id, email: user.email, roleId: user.roleId },
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
