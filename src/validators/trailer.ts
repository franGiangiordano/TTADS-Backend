import { Request, Response, NextFunction } from "express";
import { trailerSchema } from "./schemas/trailer";

const validatorTrailer = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = {
      patent: req.body.patent,
      type: req.body.type,
    };

    const isPutRequest = req.method === "PUT";

    const schema = isPutRequest ? trailerSchema.optional() : trailerSchema;

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
};

export default validatorTrailer;
