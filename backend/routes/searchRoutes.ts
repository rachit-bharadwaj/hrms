import { Router } from "express";
import { globalSearch } from "../controllers/searchController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/global", authenticate, globalSearch);

export default router;
