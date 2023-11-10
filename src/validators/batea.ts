// validatorBatea.ts
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validatorBatea = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = {
      patent: req.body.patent,
    };

    const schema = z.object({
      patent: z.string().regex(/^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/, {
        message: "Formato de patente inválido",
      }),
    });
    
    const validatedData = schema.safeParse(req.body);
    if (validatedData.success) {
      next();
    } else {
      const error = validatedData?.error?.formErrors?.fieldErrors?.patent?.[0];
      return res
        .status(400)
        .json({ message: error });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export default validatorBatea;
