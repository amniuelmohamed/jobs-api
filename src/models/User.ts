import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { BadRequestError } from "../errors";
import jwt from "jsonwebtoken";

interface IUser {
    name: string;
    email: string;
    password: string;
    createToken: () => string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        minlength: 5,
        maxlength: 255,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
    },
});

userSchema.pre("save", async function () {
    const user = this;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

userSchema.methods.createToken = function () {
    if (!process.env.JWT_SECRET)
        throw new BadRequestError("JWT Private Key is not defined");

    return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME || "30d",
    });
};

userSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>("User", userSchema);
