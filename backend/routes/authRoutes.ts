import { Router } from "express";
import { login, getMe } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.get("/me", authenticate, getMe);

export default authRoutes;
