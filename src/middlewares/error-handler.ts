import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors";

export const errorHandlerMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let customError = {
        message: err.message || "Internal Server Error",
        code:
            err instanceof CustomError
                ? err.code
                : StatusCodes.INTERNAL_SERVER_ERROR,
    };

    if (err.name === "ValidationError") {
        customError.code = StatusCodes.BAD_REQUEST;
        customError.message = Object.keys(err).includes("errors")
            ? Object.values((err as any).errors)
                  .map((val: any) => val.message)
                  .join(". ")
            : err.message;
    }

    if (Object.keys(err).includes("code") && (err as any).code === 11000) {
        customError.code = StatusCodes.BAD_REQUEST;
        customError.message = `Duplicate field value entered: ${Object.keys(
            (err as any).keyValue
        )}`;
    }

    if (err.name === "CastError") {
        customError.code = StatusCodes.NOT_FOUND;
        customError.message = Object.keys(err).includes("value")
            ? `Resource not found with id of ${(err as any).value}`
            : err.message;
    }

    res.status(customError.code).json({ error: customError.message });
};
