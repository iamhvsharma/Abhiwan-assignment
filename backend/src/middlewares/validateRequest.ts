import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.issues
        .map((err: any) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return res.status(400).json({
        msg: "Validation error",
        errors: errorMessages,
        details: result.error.issues,
      });
    }
    req.body = result.data;
    next();
  };
};
