import { Router } from "express";
import {
  getLeaveTypes,
  applyLeave,
  getMyLeaveRequests,
  getPendingLeaveRequests,
  updateLeaveStatus,
  getLeaveBalances,
} from "../controllers/leaveController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/types", getLeaveTypes);
router.post("/apply", applyLeave);
router.get("/my-requests", getMyLeaveRequests);
router.get("/pending", authorize(["Super Admin", "HR Admin", "Manager"]), getPendingLeaveRequests);
router.put("/status/:id", authorize(["Super Admin", "HR Admin", "Manager"]), updateLeaveStatus);
router.get("/balances", getLeaveBalances);

export default router;
