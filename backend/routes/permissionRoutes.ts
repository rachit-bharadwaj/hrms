import { Router } from "express";
import {
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permissionController";

const permissionRoutes = Router();

permissionRoutes.get("/", getPermissions);
permissionRoutes.get("/:id", getPermissionById);
permissionRoutes.post("/", createPermission);
permissionRoutes.put("/:id", updatePermission);
permissionRoutes.delete("/:id", deletePermission);

export default permissionRoutes;
