import { Request, Response, NextFunction } from "express";
import { equipmentSchema } from "./schemas/equipment";

const validatorEquipment: ((
  req: Request,
  res: Response,
  next: NextFunction
) => void)[] = [
  (req, res, next) => {
    try {
      req.body = {
        description: req.body.description,        
        driver: req.body.driver,        
        batea: req.body.batea,        
        trailer: req.body.trailer,        
      }

      const isPutRequest = req.method === "PUT";
      
      const schema = isPutRequest ? equipmentSchema.optional() : equipmentSchema;

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
  },
];

export default validatorEquipment;
