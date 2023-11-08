import express from "express";
import {
  getTrailers,
  getTrailer,
  createTrailer,
  updateTrailer,
  deleteTrailer,
} from "../controllers/trailer";
import validatorTrailer from "../validators/trailer";
import { verifyToken, isManager, isAdmin } from "../middlewares/authJwt.js";

const router = express.Router();

router.get("/", getTrailers);
router.get("/:id", getTrailer);
router.post("/", [verifyToken, isAdmin], validatorTrailer, createTrailer);
router.put("/:id", [verifyToken, isAdmin], validatorTrailer, updateTrailer);
router.delete("/:id", [verifyToken, isAdmin], deleteTrailer);

export default router;
