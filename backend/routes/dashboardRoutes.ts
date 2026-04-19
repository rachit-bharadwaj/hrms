import express from "express";
import { getDashboardSummary } from "../controllers/dashboardController";

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics and trends
 */
router.get("/summary", getDashboardSummary);

export default router;
