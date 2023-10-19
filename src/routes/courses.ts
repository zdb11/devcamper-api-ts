import express, { Router } from "express";
import { getCourses, getCourse, addCourse, updateCourse, deleteCourse } from "../controllers/courses.js";
import { CourseModel } from "../models/Course.js";
import { advancedResult } from "../middleware/advancedResult.js";
import { PopulateOptions } from "mongoose";
export const coursesRouter: Router = express.Router({ mergeParams: true });

const getCoursesPopulteOpt: PopulateOptions = {
    path: "bootcamp",
    select: "name description",
};

coursesRouter.route("/").get(advancedResult(CourseModel, getCoursesPopulteOpt), getCourses).post(addCourse);
coursesRouter.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);
