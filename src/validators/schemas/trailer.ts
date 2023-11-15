import { z } from "zod";

const typeValidation = z
      .string()
      .regex(/^[A-Za-z\s]+$/, {
        message: "El campo tipo debe contener solo letras",
      })
      .min(1);

const patentValidation = z
    .string()      
    .regex(/^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/,{
        message: "Formato de patente inválido",
    });

export const trailerSchema = z.object({
    type: typeValidation,
    patent: patentValidation,
});    