import { Router } from "express";
import {
  getSalaryStructure,
  updateSalaryStructure,
  processPayroll,
  getMyPayslips,
  getPayslipDetail,
} from "../controllers/payrollController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

// Employee routes

/**
 * @swagger
 * /api/payroll/my-payslips:
 *   get:
 *     summary: Get current user's payslips
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payslips
 */
router.get("/my-payslips", authorize("payroll.view_own"), getMyPayslips);

/**
 * @swagger
 * /api/payroll/payslip/{id}:
 *   get:
 *     summary: Get payslip detail by ID
 *     tags: [Payroll]
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
 *         description: Payslip details
 */
router.get("/payslip/:id", authorize("payroll.view_own"), getPayslipDetail);

// Admin routes

/**
 * @swagger
 * /api/payroll/structure/{employeeId}:
 *   get:
 *     summary: Get salary structure for an employee
 *     tags: [Payroll]
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
 *         description: Salary structure
 */
router.get("/structure/:employeeId", authorize("payroll.view_all"), getSalaryStructure);

/**
 * @swagger
 * /api/payroll/structure/{employeeId}:
 *   put:
 *     summary: Update salary structure for an employee
 *     tags: [Payroll]
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
 *         description: Structure updated
 */
router.put("/structure/:employeeId", authorize("payroll.manage"), updateSalaryStructure);

/**
 * @swagger
 * /api/payroll/process:
 *   post:
 *     summary: Process payroll for a month
 *     tags: [Payroll]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payroll processed
 */
router.post("/process", authorize("payroll.manage"), processPayroll);

export default router;
