import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validatorEquipment: ((
  req: Request,
  res: Response,
  next: NextFunction
) => void)[] = [
  (req, res, next) => {
    try {
      console.log(req.body)
      req.body = {
        description: req.body.description,        
        until_date: req.body.until_date,        
        driver: req.body.driver,        
        batea: req.body.batea,        
        trailer: req.body.trailer,        
      }

      const isPutRequest = req.method === "PUT";

      const description = z
      .string()
      .nonempty({ message: "La descripción no puede estar vacía" });

      //Falta validar fecha
      const until_date = z.string();

//Estaria bueno reutilizar los otros validadores pero no se como hacerlo
      const batea = z
      .object({
        patent: z
          .string()
          .regex(/^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/, {
            message: "Formato de patente inválido",
          }),
      });

      const trailer = z
        .object({
          patent: z
            .string()
            .regex(/^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/, {
              message: "Formato de patente inválido",
            }),
        });

      const driver = z
        .object({
          legajo: z
            .string()
            .refine((value) => {
              const legajoNumber = parseFloat(value);
              return !isNaN(legajoNumber) && legajoNumber > 0;
            }, {
              message: "El campo legajo debe ser un número mayor a 0",
            }),
        });
 
      const schema = z.object({
        description: isPutRequest ? description.optional() : description,
        until_date: isPutRequest ? until_date.optional() : until_date, 
        batea: isPutRequest ? batea.optional() : batea,  
        trailer: isPutRequest ? trailer.optional() : trailer,  
        driver: isPutRequest ? driver.optional() : driver,  
      });

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
