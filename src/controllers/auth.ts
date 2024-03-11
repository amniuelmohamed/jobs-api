import { Request, Response } from "express";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";

export const register = async (req: Request, res: Response) => {
    const user = await User.create({ ...req.body });
    const token = user.createToken();

    res.status(StatusCodes.CREATED).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token: token,
    });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new NotFoundError("User with this email does not exist");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const token = user.createToken();

    res.status(StatusCodes.OK).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        token: token,
    });
};
