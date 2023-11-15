import { Router } from "express";

import { 
  createTravel,
  getTravels,
  getTravelById,
  updateTravelById,
  deleteTravelById, 
} from "../controllers/travel"; 
import validatorTravel from "../validators/travel";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/",getTravels);
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