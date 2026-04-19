import { Router } from "express";
import {
  getDepartments,
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats,
} from "../controllers/departmentController";
import { authorize } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getDepartments);
router.get("/stats", getDepartmentStats);
router.get("/:id", getDepartmentById);
router.post("/", authorize(["Super Admin"]), createDepartment);
router.put("/:id", authorize(["Super Admin"]), updateDepartment);
router.delete("/:id", authorize(["Super Admin"]), deleteDepartment);

export default router;
