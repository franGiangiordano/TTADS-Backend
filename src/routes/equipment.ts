import { Router } from "express";

import { 
  createEquipment,
  getEquipments,
  getEquipmentById,
  updateEquipmentById,
  deleteEquipmentById 
} from "../controllers/equipment"; 
import validatorEquipment from "../validators/equipment";
import { verifyToken, isManager, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/",getEquipments);
router.get("/:equipmentId", getEquipmentById);
router.post("/", [verifyToken, isAdmin], validatorEquipment, createEquipment);
router.put(
    "/:equipmentId",   
    [verifyToken, isAdmin], 
    validatorEquipment,
    updateEquipmentById
  );
router.delete(
  "/:equipmentId", 
  [verifyToken, isAdmin], 
    validatorEquipment,
  deleteEquipmentById
  );  
export default router;