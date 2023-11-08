import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validatorTrailer: ((
  req: Request,
  res: Response,
  next: NextFunction
) => void)[] = [
  (req, res, next) => {
    try {
      req.body = {
        patent: req.body.patent,
        type: req.body.type,
      };

      const typeValidation = z
        .string()
        .regex(/^[A-Za-z\s]+$/, {
          message: "El campo tipo debe contener solo letras",
        })
        .min(1);

      const isPutRequest = req.method === "PUT";

      const schema = z.object({
        type: isPutRequest ? typeValidation.optional() : typeValidation,

        patent: z.string().regex(/^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/, {
          message: "Formato de patente inválido",
        }),
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

export default validatorTrailer;
