import { Router } from "express";
import userRoutes from "./user.routes";
import listingRoutes from "./listing.routes";
import reservationRoutes from "./reservation.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/listings", listingRoutes);
router.use("/reservations", reservationRoutes);

export default router;
