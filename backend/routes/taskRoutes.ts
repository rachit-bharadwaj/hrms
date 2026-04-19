import { Router } from "express";
import { createTask, getTasks, updateTask, addTaskComment } from "../controllers/taskController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", getTasks);
router.post("/", authorize(["Super Admin", "HR Admin", "Manager"]), createTask);
router.put("/:id", updateTask);
router.post("/comment", addTaskComment);

export default router;
