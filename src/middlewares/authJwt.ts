import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { Request, Response } from "express";
import { NextFunction } from "express";

import User from "../models/user";
import Role from "../models/role";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.headers["x-access-token"] as string;
  const secret = process.env.SECRET || "";

  if (!token)
    return res.status(403).json({ message: "No se recibió ningún token" });
  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "object" && "id" in decoded) {
      req.userId = decoded.id;
    }

    const user = await User.findById(req.userId, { password: 0 });
    if (!user)
      return res
        .status(404)
        .json({ message: "No se pudo encontrar el usuario" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "No autorizado!" });
  }
}

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      const roles = await Role.find({ _id: { $in: user.roles } });

      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
    }
    return res
      .status(403)
      .json({ message: "Requiere permisos de administrador!" });
  } catch (error) {
    return res.status(500).send({ message: "Ocurrió un error" });
  }
};

export const isManager = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      const roles = await Role.find({ _id: { $in: user.roles } });

      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "manager") {
          next();
          return;
        }
      }
    }
    return res.status(403).json({ message: "Requiere permisos de gerente!" });
  } catch (error) {
    return res.status(500).send({ message: "Ocurrió un error" });
  }
};
