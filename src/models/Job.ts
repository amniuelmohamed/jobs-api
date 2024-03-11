import { Schema, model } from "mongoose";

interface IJob {
    title: string;
    company: string;
    status: string;
    userId: Schema.Types.ObjectId;
    createdAt?: string;
    updatedAt?: string;
}

const jobSchema = new Schema<IJob>(
    {
        title: {
            type: String,
            required: [true, "Please provide a job title"],
            minlength: 2,
            maxlength: 100,
        },
        company: {
            type: String,
            required: [true, "Please provide a company"],
            minlength: 2,
            maxlength: 50,
        },
        status: {
            type: String,
            enum: ["pending", "interview", "declined"],
            default: "pending",
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide a user id"],
        },
    },
    { timestamps: true }
);

export const Job = model<IJob>("Job", jobSchema);
