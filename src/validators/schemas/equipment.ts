import { z } from "zod";
import { bateaSchema } from "./batea";
import { driverSchema } from "./driver";
import { trailerSchema } from "./trailer";

const description = z
      .string()
      .nonempty({ message: "La descripción no puede estar vacía" });

export const equipmentSchema = z.object({
    description: description,
    batea: bateaSchema,  
    trailer: trailerSchema,  
    driver: driverSchema,  
});