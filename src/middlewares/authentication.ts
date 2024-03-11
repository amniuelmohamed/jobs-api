import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError(
            "Unauthorized! Please provide a valid token"
        );
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (
            !decoded ||
            typeof decoded !== "object" ||
            !decoded.hasOwnProperty("id")
        ) {
            throw new UnauthorizedError(
                "Unauthorized! Please provide a valid token"
            );
        }

        req.user = { id: decoded.id };
        next();
    } catch (error) {
        throw new UnauthorizedError(
            "Unauthorized! Please provide a valid token"
        );
    }
};
