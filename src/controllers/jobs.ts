import { Request, Response } from "express";
import { Job } from "../models/Job";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";

export const getJobs = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const jobs = await Job.find({ userId })
        .select("-__v -userId")
        .sort("-createdAt");

    res.status(StatusCodes.OK).json({
        count: jobs.length,
        jobs,
    });
};

export const getJob = async (req: Request, res: Response) => {
    const {
        user: { id: userId },
        params: { id: jobId },
    } = req;

    const job = await Job.findOne({ _id: jobId, userId: userId }).select(
        "-__v -userId"
    );

    if (!job) {
        throw new NotFoundError("Job not found");
    }

    res.status(StatusCodes.OK).json({
        job,
    });
};

export const createJob = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { title, company } = req.body;

    const job = await Job.create({ title, company, userId });

    res.status(StatusCodes.CREATED).json({
        job: {
            id: job._id,
            title: job.title,
            company: job.company,
            status: job.status,
            userId: job.userId,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
        },
    });
};

export const updateJob = async (req: Request, res: Response) => {
    const {
        user: { id: userId },
        params: { id: jobId },
        body: { title, company, status },
    } = req;

    if (!title && !company && !status) {
        throw new BadRequestError(
            "Please provide at least one field to update"
        );
    }

    let fieldsToUpdate: {
        title?: string;
        company?: string;
        status?: "pending" | "interview" | "declined";
    } = {};

    if (title) {
        fieldsToUpdate.title = title;
    }

    if (company) {
        fieldsToUpdate.company = company;
    }

    if (status) {
        if (!["pending", "interview", "declined"].includes(status)) {
            throw new BadRequestError("Invalid status");
        }
        fieldsToUpdate.status = status;
    }

    const job = await Job.findOneAndUpdate(
        { _id: jobId, userId },
        fieldsToUpdate,
        {
            new: true,
            runValidators: true,
        }
    ).select("-__v -userId");

    if (!job) {
        throw new NotFoundError("Job not found");
    }

    res.status(StatusCodes.OK).json({
        job,
    });
};

export const deleteJob = async (req: Request, res: Response) => {
    const {
        user: { id: userId },
        params: { id: jobId },
    } = req;

    const job = await Job.findOneAndDelete({ _id: jobId, userId });

    if (!job) {
        throw new NotFoundError("Job not found");
    }

    res.status(StatusCodes.OK).json({
        message: "Job deleted successfully",
    });
};
