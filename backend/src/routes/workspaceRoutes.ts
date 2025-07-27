import { Router } from "express";
import {
  createWorkspace,
  joinWorkspace,
  getWorkspace,
  removeUserFromWorkspace,
  leaveWorkspace,
  getManagerWorkspaces
} from "../controllers/workspaceController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";


const router = Router();

router.post("/", requireAuth, requireRole("MANAGER"), createWorkspace);
router.post("/join", requireAuth, requireRole("TEAM"), joinWorkspace);
router.get("/manager", requireAuth, requireRole("MANAGER"), getManagerWorkspaces);
router.get("/:workspaceNumber", requireAuth, getWorkspace);
router.patch("/leave", requireAuth, requireRole("TEAM"), leaveWorkspace);
router.post(
  "/remove-user",
  requireAuth,
  requireRole("MANAGER"),
  removeUserFromWorkspace
);

export default router;
