import { Router } from "express";

import { 
  createRepair,
  getRepairs,
  getRepairById,
  updateRepair,
  deleteRepair 
} from "../controllers/repair"; 
import validatorRepair from "../validators/repair";
import { verifyToken, isManager, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/",getRepairs);
router.get("/:repairId", getRepairById);
router.post("/", [verifyToken, isAdmin], validatorRepair, createRepair);
router.put(
    "/:repairId",   
    [verifyToken, isAdmin], 
    validatorRepair,
    updateRepair
  );
router.delete(
  "/:repairId", 
  [verifyToken, isAdmin], 
  deleteRepair
  );  
export default router;
