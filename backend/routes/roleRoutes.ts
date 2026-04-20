import { Router } from "express";
import { authorize } from "../middleware/authMiddleware";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignPermissionToRole,
  removePermissionFromRole,
} from "../controllers/roleController";

const roleRoutes = Router();

// GET /api/roles is needed for user management dropdowns as well
roleRoutes.get("/", authorize(["roles.manage", "users.manage"]), getRoles);
roleRoutes.get("/:id", authorize(["roles.manage", "users.manage"]), getRoleById);

// Write operations strictly for role managers
roleRoutes.use(authorize("roles.manage"));

roleRoutes.post("/", createRole);
roleRoutes.put("/:id", updateRole);
roleRoutes.delete("/:id", deleteRole);
roleRoutes.post("/assign-permission", assignPermissionToRole);
roleRoutes.post("/remove-permission", removePermissionFromRole);

export default roleRoutes;
