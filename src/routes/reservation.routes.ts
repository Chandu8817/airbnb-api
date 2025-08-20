import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createReservation, getUserReservations, cancelReservation } from "../controllers/reservation.controller";

const router = Router();

router.post("/", authMiddleware, createReservation);
router.get("/me", authMiddleware, getUserReservations);
router.delete("/:id", authMiddleware, cancelReservation);

export default router;
