import express from "express";

import {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../controllers/driver";
import validatorDriver from "../validators/driver";
import { verifyToken, isManager, isAdmin } from "../middlewares/authJwt.js";

const router = express.Router();

router.get("/", getDrivers);
router.get("/count", getDrivers);
router.get("/:id", getDriver);
router.post("/", [verifyToken, isAdmin], validatorDriver, createDriver);
router.put("/:id", [verifyToken, isAdmin], validatorDriver, updateDriver);
router.delete("/:id", [verifyToken, isAdmin], deleteDriver);

export default router;
