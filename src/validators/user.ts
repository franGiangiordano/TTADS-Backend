import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validatorUser: ((req: Request, res: Response, next: NextFunction) => void)[] = [
    (req, res, next) => {
        try {
            const isPutRequest = req.method === "PUT";

            const schema = z.object({
                name: isPutRequest ? z.string().regex(/^[A-Za-z\s]+$/, { message: "El campo nombre debe contener solo letras" }).min(1).optional() : z.string().regex(/^[A-Za-z\s]+$/, { message: "El campo nombre debe contener solo letras" }).min(1),
                email: isPutRequest ? z.string().email({ message: "El campo email debe ser una dirección de correo válida" }).optional() : z.string().email({ message: "El campo email debe ser una dirección de correo válida" }),
                password: isPutRequest ? z.string().min(1, { message: "El campo contraseña no puede estar vacío" }).optional() : z.string().min(1, { message: "El campo contraseña no puede estar vacío" }),
            });

            const validatedData = schema.safeParse(req.body);

            if (validatedData.success) {
                next();
            } else {
                return res.status(400).json({ errors: validatedData.error.formErrors.fieldErrors });
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    },
];

export default  validatorUser;
