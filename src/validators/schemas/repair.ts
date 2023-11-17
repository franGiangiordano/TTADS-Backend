import { z } from "zod";
import { equipmentSchema } from "./equipment";

const description = z
  .string()
  .nonempty({ message: "La descripción no puede estar vacía" });

const cost = z
  .string()
  .refine(value => /^\$?\d+(\.\d{1,2})?$/.test(value), {
    message: "El campo de costo debe ser un número válido"
  });

export const repairSchema = z.object({
  description: description,
  cost: cost,
  equipment: equipmentSchema,
});