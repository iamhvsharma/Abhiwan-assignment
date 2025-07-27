import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addNote,
} from "../controllers/taskController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validateRequest";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  addNoteSchema,
} from "../utils/zodSchemas";

const router = Router();

router.post("/", requireAuth, requireRole("MANAGER"), validateBody(createTaskSchema), createTask);
router.get("/:workspaceNumber", requireAuth, getTasks);
router.put("/:taskId", requireAuth, requireRole("MANAGER"), validateBody(updateTaskSchema), updateTask);
router.delete("/:taskId", requireAuth, requireRole("MANAGER"), deleteTask);

router.patch("/status", requireAuth, requireRole("TEAM"), validateBody(updateTaskStatusSchema), updateTaskStatus);
router.post("/note", requireAuth, requireRole("TEAM"), validateBody(addNoteSchema), addNote);

export default router;
