import { Router } from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController";
import { authorize } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authorize(["Super Admin", "HR Manager"]), getEmployees);
router.get("/:id", authorize(["Super Admin", "HR Manager", "Department Head"]), getEmployeeById);
router.post("/", authorize(["Super Admin", "HR Manager"]), createEmployee);
router.put("/:id", authorize(["Super Admin", "HR Manager"]), updateEmployee);
router.delete("/:id", authorize(["Super Admin", "HR Manager"]), deleteEmployee);

export default router;
