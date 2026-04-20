import { Router } from "express";
import { getHolidays, addHoliday, deleteHoliday } from "../controllers/holidayController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/holidays:
 *   get:
 *     summary: Get all holidays
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of holidays
 */
router.get("/", authorize("holidays.view"), getHolidays);

/**
 * @swagger
 * /api/holidays:
 *   post:
 *     summary: Add a new holiday
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Holiday added
 */
router.post("/", authorize("holidays.manage"), addHoliday);

/**
 * @swagger
 * /api/holidays/{id}:
 *   delete:
 *     summary: Delete a holiday
 *     tags: [Holidays]
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
 *         description: Holiday deleted
 */
router.delete("/:id", authorize("holidays.manage"), deleteHoliday);

export default router;
