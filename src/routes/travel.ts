import { Router } from "express";

import {
  createTravel,
  getTravelById,
  updateTravelById,
  deleteTravelById,
  postSearchTravels,
} from "../controllers/travel";
import validatorTravel from "../validators/travel";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.post("/search", postSearchTravels);
router.get("/:travelId", getTravelById);
router.post("/", [verifyToken, isAdmin], validatorTravel, createTravel);
router.put(
  "/:travelId",
  [verifyToken, isAdmin],
  validatorTravel,
  updateTravelById
);
router.delete(
  "/:travelId",
  [verifyToken, isAdmin],
  deleteTravelById
);
export default router;