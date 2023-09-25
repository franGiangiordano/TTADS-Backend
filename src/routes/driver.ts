import express from "express";
import { getDrivers, getDriver, createDriver, updateDriver, deleteDriver } from "../controllers/driver";
import validatorDriver from "../validators/driver";
import { verifyToken , isManager, isAdmin} from "../middlewares/authJwt.js";

const router = express.Router();

router.get("/", getDrivers);
router.get("/:id", getDriver);
router.post("/", [verifyToken, isManager], validatorDriver, createDriver);
router.put("/:id", [verifyToken, isManager], validatorDriver, updateDriver);
router.delete("/:id", [verifyToken, isAdmin],  deleteDriver);

export default router;