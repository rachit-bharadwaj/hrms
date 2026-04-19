import { Router } from "express";
import {
  markAttendance,
  bulkMarkAttendance,
  getAttendanceByDate,
  getEmployeeMonthlyReport,
  getDepartmentAttendanceSummary,
  exportAttendanceCSV,
} from "../controllers/attendanceController";
import { authorize } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAttendanceByDate);
router.post("/mark", markAttendance);
router.post("/bulk-mark", authorize(["Super Admin", "HR Admin"]), bulkMarkAttendance);
router.get("/employee/:employeeId", getEmployeeMonthlyReport);
router.get("/department-summary", getDepartmentAttendanceSummary);
router.get("/export", exportAttendanceCSV);

export default router;
