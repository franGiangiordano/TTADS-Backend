import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validatorUser: ((
  req: Request,
  res: Response,
  next: NextFunction
) => void)[] = [
  (req, res, next) => {
    try {

      req.body = {
        name: req.body.name,        
        email: req.body.email,        
        password: req.body.password, 
        newPassword: req.body.newPassword, 
        roles: req.body.roles      
      }

      const isPutRequest = req.method === "PUT";
      const nameOptional =
        req.originalUrl === "/api/auth/signin" || req.method === "PUT";

      const nameValidation = z
        .string()
        .regex(/^[A-Za-z\s]+$/, {
          message: "El campo nombre debe contener solo letras",
        })
        .min(1);

      const emailValidation = z.string().email({
        message: "El campo email debe ser una dirección de correo válida",
      });

      const passValidation = z
        .string()
        .min(1, { message: "El campo contraseña no puede estar vacío" });

      const schema = z.object({
        name: nameOptional ? nameValidation.optional() : nameValidation,
        email: isPutRequest ? emailValidation.optional() : emailValidation,
        password: isPutRequest ? passValidation.optional() : passValidation,
        newPassword: passValidation.optional(),
      });

      const validatedData = schema.safeParse(req.body);

      if (validatedData.success) {
        next();
      } else {
        return res
          .status(400)
          .json({ message: validatedData.error.formErrors.fieldErrors });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
];

export default validatorUser;
