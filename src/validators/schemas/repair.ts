import { z } from "zod";
import { equipmentSchema } from "./equipment";

const description = z
  .string()
  .nonempty({ message: "La descripción no puede estar vacía" });

const cost = z
  .number()
  .positive({ message: "El costo debe ser un número positivo" });

const km = z
  .number()
  .positive({ message: "El km debe ser un número positivo" });

export const repairSchema = z.object({
  description: description,
  cost: cost,
  km: km,
  equipment: equipmentSchema,
});
