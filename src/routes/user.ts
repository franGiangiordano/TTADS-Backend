import express from "express";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePasswords,
} from "../controllers/user";
import validatorUser from "../validators/user";
import { verifyToken} from "../middlewares/authJwt.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", validatorUser, updateUser);
router.delete("/:id", deleteUser);
router.put("/change-password/:id", [verifyToken], validatorUser, changePasswords);

export default router;
