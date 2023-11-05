import express from "express";
import { addReview, getReview, getReviews } from "../controllers/reviews.js";
import { advancedResult } from "../middleware/advancedResult.js";
import { ReviewModel } from "../models/Review.js";
import { PopulateOptions } from "mongoose";
import { authorize, protect } from "../middleware/auth.js";

export const reviewRouter = express.Router({ mergeParams: true });
const getReviewsPopulteOpt: PopulateOptions = {
    path: "bootcamp",
    select: "name description",
};
reviewRouter.route("/").get(advancedResult(ReviewModel, getReviewsPopulteOpt), getReviews);
reviewRouter
    .route("/:id")
    .get(getReview)
    .post(protect, authorize(["user", "admin"]), addReview);
