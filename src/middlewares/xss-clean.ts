import { Request, Response, NextFunction } from "express";
import xss from "xss";

// Define a function to sanitize user input
const sanitizeInput = (input: string): string => {
    // Use xss library to sanitize input
    return xss(input);
};

// Combined middleware function to sanitize request body, query, and params
export const xssCleanMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Sanitize request body
    if (req.body) {
        Object.keys(req.body).forEach((key) => {
            req.body[key] = sanitizeInput(req.body[key]);
        });
    }

    // Sanitize request query
    if (req.query) {
        Object.keys(req.query).forEach((key) => {
            const value = req.query[key] as string;
            req.query[key] = sanitizeInput(value);
        });
    }

    // Sanitize request params (route parameters)
    if (req.params) {
        Object.keys(req.params).forEach((key) => {
            const value = req.params[key] as string;
            req.params[key] = sanitizeInput(value);
        });
    }

    next();
};
