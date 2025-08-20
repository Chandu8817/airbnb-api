import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/me", authMiddleware, userController.getMe);

export default router;
