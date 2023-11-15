import { z } from "zod";

export const bateaSchema = z.object({
    patent: z.string().regex(/^[A-Z0-9]{2,3}-?[A-Z0-9]{2,4}$/, {
      message: "Formato de patente inválido",
    }),
});