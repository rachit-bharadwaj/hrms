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
router.get("/types", getLeaveTypes);
router.post("/apply", applyLeave);
router.get("/my-requests", getMyLeaveRequests);
router.get("/balances", getLeaveBalances);

// Manager/Admin routes
router.get("/pending", authorize(["Super Admin", "HR Admin", "Manager"]), getPendingLeaveRequests);
router.put("/status/:id", authorize(["Super Admin", "HR Admin", "Manager"]), updateLeaveStatus);

// Admin-only logic
router.post("/carry-forward", authorize(["Super Admin", "HR Admin"]), carryForwardLeaves);
router.post("/encash", authorize(["Super Admin", "HR Admin"]), encashLeave);

export default router;
