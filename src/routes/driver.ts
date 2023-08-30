import express from "express";
import { getDrivers, getDriver, createDriver, updateDriver, deleteDriver } from "../controllers/driver";
import validatorDriver from "../validators/driver";

const router = express.Router();

router.get("/", getDrivers);
router.get("/:id", getDriver);
router.post("/", validatorDriver, createDriver);
router.put("/:id",  validatorDriver, updateDriver);
router.delete("/:id",  deleteDriver);

export default router;