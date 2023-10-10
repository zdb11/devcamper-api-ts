import type { Request, Response } from "express";
import { CourseModel } from "../models/Course.js";
import { asyncHandler } from "../middleware/async.js";

// @desc        Get all courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:id/courses
// @access      Public
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
    let query;
    if (req.params.id) {
        query = CourseModel.find({ bootcamp: req.params.id });
    } else {
        query = CourseModel.find();
    }
    const courses = await query;
    res.status(200).json({ success: true, count: courses.length, data: courses });
});
