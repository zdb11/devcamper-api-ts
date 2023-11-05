import { Request, Response } from "express";
import { asyncHandler } from "../middleware/async.js";
import { ReviewModel } from "../models/Review.js";
import { Result } from "../interfaces/interfaces.js";

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
