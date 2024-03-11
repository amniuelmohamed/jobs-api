import { Router } from "express";
import {
    createJob,
    deleteJob,
    getJob,
    getJobs,
    updateJob,
} from "../controllers/jobs";

const router = Router();

router.route("/").get(getJobs).post(createJob);
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

export default router;
