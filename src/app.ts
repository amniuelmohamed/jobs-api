import "dotenv/config";
import "express-async-errors";
import express from "express";

import authRouter from "./routes/auth";
import jobsRouter from "./routes/jobs";

import { notFoundMiddleware } from "./middlewares/not-found";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { authMiddleware } from "./middlewares/authentication";

import run from "./db/connect";

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { xssCleanMiddleware } from "./middlewares/xss-clean";

const app = express();

app.use(express.json());

app.set("trust proxy", 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
        "Too many requests from this IP, please try again after 15 minutes",
});

app.use("/api/v1/auth", limiter);
app.use(helmet());
app.use(cors());
app.use(xssCleanMiddleware);

app.get("/", (req, res) => {
    res.send("Welcome to the Job Board API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is required!");
        }

        await run(process.env.MONGO_URI);

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
};

start();
