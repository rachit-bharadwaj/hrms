import express from "express";
import { getDashboardSummary } from "../controllers/dashboardController";
import { authorize } from "../middleware/authMiddleware";

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
router.get("/summary", authorize("dashboard.view"), getDashboardSummary);

export default router;
