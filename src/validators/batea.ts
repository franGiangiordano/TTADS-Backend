import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validatorBatea: ((
  req: Request,
  res: Response,
  next: NextFunction
) => void)[] = [
  (req, res, next) => {
    try {
      const schema = z.object({
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
          .json({ errors: validatedData.error.formErrors.fieldErrors });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
];

export default validatorBatea;
