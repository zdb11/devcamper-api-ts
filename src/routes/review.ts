import express from "express";
import { addReview, deleteReview, getReview, getReviews, updateReview } from "../controllers/reviews.js";
import { advancedResult } from "../middleware/advancedResult.js";
import { ReviewModel } from "../models/Review.js";
import { PopulateOptions } from "mongoose";
import { authorize, protect } from "../middleware/auth.js";

export const reviewRouter = express.Router({ mergeParams: true });
const getReviewsPopulteOpt: PopulateOptions = {
    path: "bootcamp",
    select: "name description",
};
reviewRouter
    .route("/")
    .get(advancedResult(ReviewModel, getReviewsPopulteOpt), getReviews)
    .post(protect, authorize(["user", "admin"]), addReview);
reviewRouter
    .route("/:id")
    .get(getReview)
    .put(protect, authorize(["user", "admin"]), updateReview)
    .delete(protect, authorize(["user", "admin"]), deleteReview);
