import mongoose, { Model, Schema } from "mongoose";
import { BootcampModel } from "./Bootcamp.js";

interface IReview extends Document {
    _id: Schema.Types.ObjectId;
    title: string;
    text: string;
    rating: number;
    createdAt: Date;
    bootcamp: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
}

interface IReviewModel extends Model<IReview> {
    getAverageRating(bootcampId: Schema.Types.ObjectId): Promise<void>;
}

const ReviewSchema = new Schema<IReview, IReviewModel>({
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

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index(
    {
        bootcamp: 1,
        user: 1,
    },
    { unique: true }
);

ReviewSchema.static("getAverageRating", async function (bootcampId: Schema.Types.ObjectId) {
    const aggregate = await this.aggregate([
        {
            $match: {
                bootcamp: bootcampId,
            },
        },
        {
            $group: {
                _id: "$bootcamp",
                averageRating: {
                    $avg: "$rating",
                },
            },
        },
    ]);
    const averageRating = aggregate[0]?.averageRating ?? 0;
    try {
        await BootcampModel.findByIdAndUpdate(bootcampId, {
            averageRating: Number(averageRating).toFixed(2),
        });
    } catch (error) {
        console.log(`Error when updating bootcamp with average rating ${error}`);
    }
});

// Call getAverageRating after save
ReviewSchema.post("save", function (this: IReview) {
    ReviewModel.getAverageRating(this.bootcamp);
});

// Call getAverageRating after deleteOne
ReviewSchema.pre("deleteOne", { document: true }, function (this: IReview) {
    ReviewModel.getAverageRating(this.bootcamp);
});

export const ReviewModel = mongoose.model<IReview, IReviewModel>("Review", ReviewSchema);
