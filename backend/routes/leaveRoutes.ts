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
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
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
router.get("/types", authorize("leaves.view_own"), getLeaveTypes);

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
router.post("/apply", authorize("leaves.apply"), applyLeave);

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
router.get("/my-requests", authorize("leaves.view_own"), getMyLeaveRequests);

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
router.get("/balances", authorize("leaves.view_own"), getLeaveBalances);

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
router.get("/pending", authorize("leaves.approve"), getPendingLeaveRequests);

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
router.put("/status/:id", authorize("leaves.approve"), updateLeaveStatus);

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
router.post("/carry-forward", authorize("leaves.manage"), carryForwardLeaves);

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
router.post("/encash", authorize("leaves.manage"), encashLeave);

/**
 * @swagger
 * /api/leaves/types:
 *   post:
 *     summary: Create a new leave type (Admin)
 *     tags: [Leaves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Leave type created
 */
router.post("/types", authorize("leaves.manage"), createLeaveType);

/**
 * @swagger
 * /api/leaves/types/{id}:
 *   put:
 *     summary: Update a leave type (Admin)
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
 *         description: Leave type updated
 */
router.put("/types/:id", authorize("leaves.manage"), updateLeaveType);

/**
 * @swagger
 * /api/leaves/types/{id}:
 *   delete:
 *     summary: Delete a leave type (Admin)
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
 *         description: Leave type deleted
 */
router.delete("/types/:id", authorize("leaves.manage"), deleteLeaveType);

export default router;
