import { Router } from "express";
import { login, register, getProfile } from "../controllers/authController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", requireAuth, getProfile);

export default router;
