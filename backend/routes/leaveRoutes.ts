import { Router } from "express";
import {
  getLeaveTypes,
  applyLeave,
  getMyLeaveRequests,
  getPendingLeaveRequests,
  updateLeaveStatus,
  getLeaveBalances,
  carryForwardLeaves,
  encashLeave,
} from "../controllers/leaveController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

// Employee routes

/**
 * @swagger
 * /api/leaves/types:
 *   get:
 *     summary: Get all leave types
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave types
 */
router.get("/types", getLeaveTypes);

/**
 * @swagger
 * /api/leaves/apply:
 *   post:
 *     summary: Apply for leave
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Leave applied
 */
router.post("/apply", applyLeave);

/**
 * @swagger
 * /api/leaves/my-requests:
 *   get:
 *     summary: Get current user's leave requests
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leave requests
 */
router.get("/my-requests", getMyLeaveRequests);

/**
 * @swagger
 * /api/leaves/balances:
 *   get:
 *     summary: Get current user's leave balances
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leave balances
 */
router.get("/balances", getLeaveBalances);

// Manager/Admin routes

/**
 * @swagger
 * /api/leaves/pending:
 *   get:
 *     summary: Get pending leave requests (Admin/Manager)
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending requests
 */
router.get("/pending", authorize(["Super Admin", "HR Admin", "Manager"]), getPendingLeaveRequests);

/**
 * @swagger
 * /api/leaves/status/{id}:
 *   put:
 *     summary: Update leave request status
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put("/status/:id", authorize(["Super Admin", "HR Admin", "Manager"]), updateLeaveStatus);

// Admin-only logic

/**
 * @swagger
 * /api/leaves/carry-forward:
 *   post:
 *     summary: Carry forward leaves to next year
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaves carried forward
 */
router.post("/carry-forward", authorize(["Super Admin", "HR Admin"]), carryForwardLeaves);

/**
 * @swagger
 * /api/leaves/encash:
 *   post:
 *     summary: Encash leave balances
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Leave encashed
 */
router.post("/encash", authorize(["Super Admin", "HR Admin"]), encashLeave);

export default router;
