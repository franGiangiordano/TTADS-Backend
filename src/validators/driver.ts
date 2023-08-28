import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validatorCreateDriver: ((req: Request, res: Response, next: NextFunction) => void)[] = [
    (req, res, next) => {
        try {
            const schema = z.object({
                legajo: z.number().min(1, { message: "legajo must be greater than 0"}),
                name: z.string().regex(/^[A-Za-z\s]+$/, { message: " name field must contain only letters and spaces" }).min(1),
                surname: z.string().regex(/^[A-Za-z\s]+$/, { message: " surname field must contain only letters and spaces" }).min(1),
            });

            const validatedData = schema.safeParse(req.body);

            if (validatedData.success) {
                next();
            } else {
                return res.status(400).json({ errors: validatedData.error.formErrors });
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    },
];

const validatorGetDriver: ((req: Request, res: Response, next: NextFunction) => void)[] = [
    (req, res, next) => {
        try {
            const schema = z.object({
                id: z.string().refine((value) => /^[0-9a-fA-F]{24}$/.test(value))
            });

            const validatedData = schema.safeParse({ id: req.params.id });

            if (validatedData.success) {
                next();
            } else {
                res.status(400).json({ errors: validatedData.error.formErrors });
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    },
];

export { validatorCreateDriver, validatorGetDriver };