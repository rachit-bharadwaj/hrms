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

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get attendance by date
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance records
 */
router.get("/", getAttendanceByDate);

/**
 * @swagger
 * /api/attendance/mark:
 *   post:
 *     summary: Mark attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance marked
 */
router.post("/mark", markAttendance);

/**
 * @swagger
 * /api/attendance/bulk-mark:
 *   post:
 *     summary: Bulk mark attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance marked
 */
router.post("/bulk-mark", authorize(["Super Admin", "HR Admin"]), bulkMarkAttendance);

/**
 * @swagger
 * /api/attendance/employee/{employeeId}:
 *   get:
 *     summary: Get employee monthly attendance report
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Monthly report
 */
router.get("/employee/:employeeId", getEmployeeMonthlyReport);

/**
 * @swagger
 * /api/attendance/department-summary:
 *   get:
 *     summary: Get department attendance summary
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department summary
 */
router.get("/department-summary", getDepartmentAttendanceSummary);

/**
 * @swagger
 * /api/attendance/export:
 *   get:
 *     summary: Export attendance to CSV
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 */
router.get("/export", exportAttendanceCSV);

export default router;
