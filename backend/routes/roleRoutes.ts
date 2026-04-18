import { Router } from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissionToRole,
} from "../controllers/roleController";

const roleRoutes = Router();

roleRoutes.get("/", getRoles);
roleRoutes.get("/:id", getRoleById);
roleRoutes.post("/", createRole);
roleRoutes.put("/:id", updateRole);
roleRoutes.delete("/:id", deleteRole);
roleRoutes.post("/assign-permission", assignPermissionToRole);

export default roleRoutes;
