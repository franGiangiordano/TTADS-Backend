import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { equipmentSchema } from "./schemas/equipment";

const validatorTravel: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[] = [
    (req, res, next) => {      
      try {
        req.body = {
          departure_date: req.body.departure_date,        
          arrival_date: req.body.arrival_date,        
          destination_description: req.body.destination_description,
          cost: req.body.cost,        
          km: req.body.km,        
          starting_location: req.body.starting_location,        
          final_location: req.body.final_location,
          equipment: req.body.equipment        
        }
        const arrivalDate = new Date(req.body.arrival_date);
        const departureDate = new Date(req.body.departure_date);

        const isPutRequest = req.method === "PUT";
        
        const isPastDate = (value: Date): boolean => {
            const currentDate = new Date();            
            return value <= currentDate;
          };

        const isLesser = (value: Date): boolean => {
            return value <= arrivalDate;
          };  

        const departure_date = z
            .string()
            .refine((value) => {                
                return isLesser(departureDate);
              }, {
                message: "La fecha inicio no puede ser mayor a la fecha fin",
              });

        const arrival_date = z
            .string()
            .refine((value) => {
                return isPastDate(arrivalDate);
              }, {
                message: "La fecha de llegada no puede ser mayor a la fecha actual",
              });
       
        const cost = z
           .number()
           .positive({ message: "El costo debe ser un número positivo" });
   
        const km = z
            .number()
            .positive({ message: "El km debe ser un número positivo" });
        
        const starting_location = z
            .string()
            .nonempty({ message: "La ubicación de inicio no puede estar vacía" });
        
        const final_location = z
            .string()
            .nonempty({ message: "La ubicación final no puede estar vacía" });

        const destinacion_description = z
            .string()
            .nonempty({ message: "La descripción de la ubicación no puede estar vacía" });    

        const schema = z.object({
          departure_date: isPutRequest ? departure_date.optional() : departure_date,
          arrival_date: isPutRequest ? arrival_date.optional() : arrival_date,
          destination_description: destinacion_description.optional(),
          cost: isPutRequest ? cost.optional() : cost,
          km: isPutRequest ? km.optional() : km,          
          starting_location: isPutRequest ? starting_location.optional() : starting_location,          
          final_location: isPutRequest ? final_location.optional() : final_location,          
          equipment: isPutRequest ? equipmentSchema.optional() : equipmentSchema,  
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
  
  export default validatorTravel;