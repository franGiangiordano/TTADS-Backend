import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";

import User from "../models/user.js";
import Role from "../models/role.js";
import { ROLES } from "../models/role";

dotenv.config();
const secret = process.env.SECRET || "";

export const signupHandler = async (req: Request, res: Response) => {
  try {
    if (!req.body || !req.body.roles) {
      return res.status(400).json({ message: "No se proporcionaron roles" });
    }

    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `El rol ${req.body.roles[i]} no existe`,
        });
      }
    }

    const { name, email, password, roles } = req.body;
    const newUser = new User({
      name,
      email,
      password,
    });

    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "operative" });
      if (role) {
        newUser.roles = [role._id];
      }
    }
    newUser.password = await User.encryptPassword(newUser.password);

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, secret, {
      expiresIn: 86400,
    });

    return res.status(200).json({ token });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "El usuario ya existe" });
      }
    }

    return res.status(500).json({ message: "Ocurrió un error" });
  }
};

export const signinHandler = async (req: Request, res: Response) => {
  try {
    const userFound = await User.findOne({ email: req.body.email }).populate(
      "roles"
    );

    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });
    const matchPassword = await User.comparePassword(
      req.body.password,
      userFound.password
    );

    if (!matchPassword)
      return res.status(401).json({
        token: null,
        message: "Contraseña incorrecta",
      });

    const token = jwt.sign({ id: userFound._id }, secret, {
      expiresIn: 86400,
    });

    res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Ocurrió un error" });
  }
};
