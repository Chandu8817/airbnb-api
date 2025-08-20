import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  filterListings
} from "../controllers/listing.controller";

const router = Router();

router.post("/", authMiddleware, createListing);
router.get("/filter", filterListings);
router.get("/", getListings);
router.get("/:id", getListingById);
router.put("/:id", authMiddleware, updateListing);
router.delete("/:id", authMiddleware, deleteListing);

export default router;
