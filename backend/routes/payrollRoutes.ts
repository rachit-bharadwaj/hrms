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
router.get("/my-payslips", getMyPayslips);
router.get("/payslip/:id", getPayslipDetail);

// Admin routes
router.get("/structure/:employeeId", authorize(["Super Admin", "HR Admin"]), getSalaryStructure);
router.put("/structure/:employeeId", authorize(["Super Admin", "HR Admin"]), updateSalaryStructure);
router.post("/process", authorize(["Super Admin", "HR Admin"]), processPayroll);

export default router;
