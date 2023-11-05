import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/async.js";
import { ReviewModel } from "../models/Review.js";
import { Result } from "../interfaces/interfaces.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { BootcampModel } from "../models/Bootcamp.js";

// @desc        Get all reviews
// @route       GET /api/v1/reviews
// @route       GET /api/v1/bootcamps/:id/reviews
// @access      Public
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
    if (req.params.id) {
        const reviews = await ReviewModel.find({ bootcamp: req.params.id });
        const responseData: Result = { success: true, count: reviews.length, data: reviews };
        res.status(200).json(responseData);
    } else {
        res.status(200).json(res.advancedResult);
    }
});

// @desc        Get single review
// @route       GET /api/v1/reviews/:id
// @access      Public
export const getReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const review = await ReviewModel.findById(req.params.id).populate({ path: "bootcamp", select: "name description" });
    if (!review) {
        return next(new ErrorResponse(`No review find with id ${req.params.id}`, 404));
    }
    const responseData: Result = { success: true, data: review };
    res.status(200).json(responseData);
});

// @desc        Add review
// @route       POST /api/v1/bootcamps/review
// @route       POST /api/v1/bootcamps/:bootcampId/review
// @access      Private
export const addReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body.bootcamp = req.params.id;
    req.body.user = req.user?._id;

    const bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp find with id ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user?._id.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
        return next(
            new ErrorResponse(
                `User '${req.user?._id}' is not authorized to add this review to bootcamp '${bootcamp._id}'`,
                401
            )
        );
    }

    const review = await ReviewModel.create(req.body);
    const responseData: Result = { success: true, data: review };
    res.status(200).json(responseData);
});
