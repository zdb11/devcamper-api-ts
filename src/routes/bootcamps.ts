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
import { coursesRouter } from "./courses.js";

export const bootcampRouter: Router = express.Router();

bootcampRouter.use("/:id/courses", coursesRouter);

bootcampRouter.route("/").get(getBootcamps).post(createBootcamp);
bootcampRouter.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
bootcampRouter.route("/:id/photo").put(uploadBootcampUpload);
bootcampRouter.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
