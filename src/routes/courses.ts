import express, { Router } from "express";
import { getCourses } from "../controllers/courses.js";

export const coursesRouter: Router = express.Router({ mergeParams: true });

coursesRouter.route("/").get(getCourses);
