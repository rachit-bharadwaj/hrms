import { Router } from "express";
import { login, getMe, updateProfile, changePassword } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.get("/me", authenticate, getMe);
authRoutes.post("/update-profile", authenticate, updateProfile);
authRoutes.post("/change-password", authenticate, changePassword);

export default authRoutes;
