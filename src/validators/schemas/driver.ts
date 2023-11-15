import { z } from "zod";

const legValidation = z
      .string()
      .refine((value) => {
        const legajoNumber = parseFloat(value);
        return !isNaN(legajoNumber) && legajoNumber > 0;
      }, {
        message: "El campo legajo debe ser un número mayor a 0",
      });

    const nameValidation = z
      .string()
      .regex(/^[A-Za-z\s]+$/, {
        message: "El campo nombre debe contener solo letras",
      })
      .min(1);

    const surnameValidation = z
      .string()
      .regex(/^[A-Za-z\s]+$/, {
        message: " El campo apellido debe contener solo letras",
      })
      .min(1);

export const driverSchema = z.object({
      legajo: legValidation,
      name: nameValidation,
      surname: surnameValidation,
});