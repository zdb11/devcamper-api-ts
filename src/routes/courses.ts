import express, { Router } from "express";
import { getCourses, getCourse, addCourse, updateCourse, deleteCourse } from "../controllers/courses.js";

export const coursesRouter: Router = express.Router({ mergeParams: true });

coursesRouter.route("/").get(getCourses).post(addCourse);
coursesRouter.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);
