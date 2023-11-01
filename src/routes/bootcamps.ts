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
import { getCourses } from "../controllers/courses.js";
import { BootcampModel } from "../models/Bootcamp.js";
import { advancedResult } from "../middleware/advancedResult.js";
import { protect } from "../middleware/auth.js";

export const bootcampRouter: Router = express.Router();

bootcampRouter
    .route("/")
    .get(advancedResult(BootcampModel, ["courses"]), getBootcamps)
    .post(protect, createBootcamp);
bootcampRouter.route("/:id").get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);
bootcampRouter.route("/:id/courses").get(getCourses);
bootcampRouter.route("/:id/photo").put(protect, uploadBootcampUpload);
bootcampRouter.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
