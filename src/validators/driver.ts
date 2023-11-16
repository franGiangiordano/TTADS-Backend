import { Request, Response, NextFunction } from "express";
import { driverSchema } from "./schemas/driver";

const validatorDriver = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = {
      legajo: req.body.legajo,
      name: req.body.name,
      surname: req.body.surname,
    };

    const isPutRequest = req.method === "PUT";

    const schema = isPutRequest ? driverSchema.optional() : driverSchema;

    const validatedData = schema.safeParse(req.body);

    if (validatedData.success) {
      next();
    } else {
      console.log(validatedData.error.formErrors.fieldErrors)
      return res
        .status(400)
        .json({ message: validatedData.error.formErrors.fieldErrors });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export default validatorDriver;
