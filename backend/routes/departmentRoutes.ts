import { Router } from "express";
import { getDepartments, createDepartment } from "../controllers/departmentController";
import { authorize } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getDepartments);
router.post("/", authorize(["Super Admin"]), createDepartment);

export default router;
