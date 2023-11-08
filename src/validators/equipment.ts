import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validatorEquipment: ((
  req: Request,
  res: Response,
  next: NextFunction
) => void)[] = [
  (req, res, next) => {
    try {
      
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

      const isValidDateFormat = (inputDate:any) => {
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        return datePattern.test(inputDate);
      };
      
      const isDate = (inputDate:any) => {
        return isValidDateFormat(inputDate) && !isNaN(Date.parse(inputDate));
      };

      const until_date = z
        .string()
        .refine((value) => isDate(value), {
        message: "Fecha con formato inválido (DD/MM/YYYY)",
      });

      const patent = z
      .string()
      .regex(/^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/, {
        message: "Formato de patente inválido",
      })

      const trailer = z
      .string()
      .regex(/^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/, {
        message: "Formato de trailer inválido",
      })

      const legValidation = z
        .string()
        .refine((value) => {
          const legajoNumber = parseFloat(value);
          return !isNaN(legajoNumber) && legajoNumber > 0;
        }, {
          message: "El campo legajo debe ser un número mayor a 0",
        });
  
      const schema = z.object({
        description: isPutRequest ? description.optional() : description,
        until_date: isPutRequest ? until_date.optional() : until_date, 
        patent: isPutRequest ? patent.optional() : patent,  
        trailer: isPutRequest ? trailer.optional() : trailer,  
        legValidation: isPutRequest ? legValidation.optional() : legValidation,  
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

export default validatorEquipment;
