import { Request, Response, NextFunction } from "express";
import { repairSchema } from "./schemas/repair";

const validatorRepair: ((
  req: Request,
  res: Response,
  next: NextFunction
) => void)[] = [
  (req, res, next) => {
    try {
      req.body = {
        description: req.body.description,
        cost: req.body.cost,
        equipment: req.body.equipment,
        km: req.body.km,
      };

      const isPutRequest = req.method === "PUT";

      const schema = isPutRequest ? repairSchema.optional() : repairSchema;

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

export default validatorRepair;
