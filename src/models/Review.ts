import mongoose, { Schema } from "mongoose";

interface IReview extends Document {
    _id: Schema.Types.ObjectId;
    title: string;
    text: string;
    rating: number;
    createdAt: Date;
    bootcamp: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
}
const ReviewSchema = new Schema<IReview>({
    title: {
        type: String,
        trim: true,
        require: [true, "Please add a title for the review"],
        maxlength: 100,
    },
    text: {
        type: String,
        require: [true, "Please add some text"],
    },
    rating: {
        type: Number,
        require: [true, "Please raiting from 1 to 10"],
        min: 1,
        max: 10,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        require: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true,
    },
});

export const ReviewModel = mongoose.model("Review", ReviewSchema);
