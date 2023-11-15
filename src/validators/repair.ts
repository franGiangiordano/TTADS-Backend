import { z } from "zod";
import { Request, Response, NextFunction } from "express";

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
        date: req.body.date,
        equipment: req.body.equipment,
      };

      const isPutRequest = req.method === "PUT";

      const description = z
        .string()
        .nonempty({ message: "La descripción no puede estar vacía" });

      const cost = z
        .number()
        .positive({ message: "El costo debe ser un número positivo" });

      const date = z.date();

      const equipment = z.object({
        type: z.string(),
        id: z.string(),
      });

      const schema = z.object({
        description: isPutRequest ? description.optional() : description,
        cost: isPutRequest ? cost.optional() : cost,
        date: isPutRequest ? date.optional() : date,
        equipment: isPutRequest ? equipment.optional() : equipment,
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

export default validatorRepair;


