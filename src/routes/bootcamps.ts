import express, { type Router } from "express";
import {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    uploadBootcampUpload,
} from "../controllers/bootcamps.js";
import { BootcampModel } from "../models/Bootcamp.js";
import { advancedResult } from "../middleware/advancedResult.js";
import { protect, authorize } from "../middleware/auth.js";
import { reviewRouter } from "./review.js";
import { coursesRouter } from "./courses.js";

export const bootcampRouter: Router = express.Router();

bootcampRouter
    .route("/")
    .get(advancedResult(BootcampModel, ["courses"]), getBootcamps)
    .post(protect, authorize(["publisher", "admin"]), createBootcamp);
bootcampRouter
    .route("/:id")
    .get(getBootcamp)
    .put(protect, authorize(["publisher", "admin"]), updateBootcamp)
    .delete(protect, authorize(["publisher", "admin"]), deleteBootcamp);
bootcampRouter.use("/:id/courses", coursesRouter);
bootcampRouter.use("/:id/reviews", reviewRouter);
bootcampRouter.route("/:id/photo").put(protect, authorize(["publisher", "admin"]), uploadBootcampUpload);
bootcampRouter.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
