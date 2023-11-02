import express from "express";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user";
import validatorUser from "../validators/user";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", validatorUser, updateUser);
router.delete("/:id", deleteUser);

export default router;
