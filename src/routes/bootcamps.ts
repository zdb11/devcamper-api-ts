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
import { protect, authorize } from "../middleware/auth.js";

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
bootcampRouter.route("/:id/courses").get(getCourses);
bootcampRouter.route("/:id/photo").put(protect, authorize(["publisher", "admin"]), uploadBootcampUpload);
bootcampRouter.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
