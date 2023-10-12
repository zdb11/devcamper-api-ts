import type { NextFunction, Request, Response } from "express";
import { CourseModel } from "../models/Course.js";
import { asyncHandler } from "../middleware/async.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { BootcampModel } from "../models/Bootcamp.js";

// @desc        Get all courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:id/courses
// @access      Public
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
    let query;
    if (req.params.id) {
        query = CourseModel.find({ bootcamp: req.params.id });
    } else {
        query = CourseModel.find().populate({
            path: "bootcamp",
            select: "name description",
        });
    }
    const courses = await query;
    res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc        Get course
// @route       GET /api/v1/course/:id
// @access      Public
export const getCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await CourseModel.findById(req.params.id).populate({ path: "bootcamp", select: "name description" });
    if (!course) {
        return next(new ErrorResponse(`No course find with id ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: course });
});

// @desc        Add course
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access      Private
export const addCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body.bootcamp = req.params.id;

    const bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp find with id ${req.params.id}`, 404));
    }
    const course = await CourseModel.create(req.body);
    res.status(200).json({ success: true, data: course });
});

// @desc        Update course
// @route       PUT /api/v1/courses/:id
// @access      Private
export const updateCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let course = await CourseModel.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course find with id ${req.params.id}`, 404));
    }

    course = await CourseModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: course });
});

// @desc        Delete course
// @route       DELETE /api/v1/courses/:id
// @access      Private
export const deleteCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const course = await CourseModel.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course find with id ${req.params.id}`, 404));
    }

    await CourseModel.findByIdAndRemove(req.params.id);
    res.status(200).json({ success: true, data: {} });
});
