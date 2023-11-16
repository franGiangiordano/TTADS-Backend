import { Request, Response, NextFunction } from "express";
import { bateaSchema } from "./schemas/batea";

const validatorBatea = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = {
      patent: req.body.patent,
    };
    
    const validatedData = bateaSchema.safeParse(req.body);
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
