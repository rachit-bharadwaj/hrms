import { Router } from "express";
import { getHolidays, addHoliday, deleteHoliday } from "../controllers/holidayController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

router.get("/", getHolidays);
router.post("/", authorize(["Super Admin", "HR Admin"]), addHoliday);
router.delete("/:id", authorize(["Super Admin", "HR Admin"]), deleteHoliday);

export default router;
