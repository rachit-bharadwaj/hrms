import { Router } from "express";

// controllers
import { health, home } from "../controllers/base";

const baseRoutes = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Home
 *     tags: [Base]
 *     responses:
 *       200:
 *         description: Welcome message
 */
baseRoutes.get("/", home);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API Health Check
 *     tags: [Base]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
baseRoutes.get("/health", health);

export default baseRoutes;
