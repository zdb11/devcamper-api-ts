import express from "express";
import { getReviews } from "../controllers/reviews.js";
import { advancedResult } from "../middleware/advancedResult.js";
import { ReviewModel } from "../models/Review.js";
import { PopulateOptions } from "mongoose";

export const reviewRouter = express.Router({ mergeParams: true });
const getReviewsPopulteOpt: PopulateOptions = {
    path: "bootcamp",
    select: "name description",
};
reviewRouter.route("/").get(advancedResult(ReviewModel, getReviewsPopulteOpt), getReviews);
