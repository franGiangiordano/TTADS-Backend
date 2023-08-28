import express from "express";
import { getDrivers, getDriver, createDriver, updateDriver, deleteDriver } from "../controllers/driver";
import { validatorCreateDriver, validatorGetDriver } from "../validators/driver";

const router = express.Router();

router.get("/", getDrivers);
router.get("/:id", validatorGetDriver, getDriver);
router.post("/", validatorCreateDriver, createDriver);
router.put("/:id", validatorGetDriver,  validatorCreateDriver, updateDriver);
router.delete("/:id", validatorGetDriver,  deleteDriver);

export default router;