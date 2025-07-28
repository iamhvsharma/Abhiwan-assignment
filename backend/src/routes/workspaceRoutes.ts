import { Router } from "express";
import {
  createWorkspace,
  joinWorkspace,
  getWorkspace,
  removeUserFromWorkspace,
  leaveWorkspace,
  getManagerWorkspaces,
  inviteUserToWorkspace,
  getUserWorkspace,
} from "../controllers/workspaceController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", requireAuth, requireRole("MANAGER"), createWorkspace);
router.post("/join", requireAuth, requireRole("TEAM"), joinWorkspace);
router.get(
  "/manager",
  requireAuth,
  requireRole("MANAGER"),
  getManagerWorkspaces
);
router.get("/user", requireAuth, getUserWorkspace);
router.get("/:workspaceNumber", requireAuth, getWorkspace);
router.patch("/leave", requireAuth, requireRole("TEAM"), leaveWorkspace);
router.post(
  "/remove-user",
  requireAuth,
  requireRole("MANAGER"),
  removeUserFromWorkspace
);
router.post(
  "/invite",
  requireAuth,
  requireRole("MANAGER"),
  inviteUserToWorkspace
);

export default router;
