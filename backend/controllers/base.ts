import { Request, Response } from "express";
import { API_VERSION, NODE_ENV, PORT, TIMESTAMP } from "../constants/config";
import { getLocalIpAddress } from "../utils/config";
import connectDB from "../database/connection";
import { sql } from "drizzle-orm";

export const home = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to HRMS Backend",
    version: API_VERSION,
    timestamp: TIMESTAMP,
    environment: NODE_ENV,
    ipAddress: getLocalIpAddress(),
    port: PORT,
    status: "Server is up and running",
  });
};

export const health = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const startTime = performance.now();
    const result = await db.execute(sql`SELECT 1 as "test"`);
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);
    
    const databaseHealth = {
      status: "connected",
      responseTime: `${responseTime}ms`,
    };

    res.status(200).json({
      status: "ok",
      message: "Server is up and running",
      timestamp: TIMESTAMP,
      environment: NODE_ENV,
      database: databaseHealth,
    });
  } catch (error: any) {
    res.status(503).json({
      status: "error",
      message: "Server is up but database connection failed",
      timestamp: TIMESTAMP,
      environment: NODE_ENV,
      database: {
        status: "disconnected",
        error: error.message || "Unknown database error",
      },
    });
  }
};
