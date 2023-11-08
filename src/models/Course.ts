import mongoose, { Document, Model, Schema } from "mongoose";
import { BootcampModel } from "./Bootcamp.js";

interface ICourse extends Document {
    _id: Schema.Types.ObjectId;
    title: string;
    description: string;
    weeks: string;
    tuition: number;
    minimumSkill: string;
    scholarshipsAvailable: boolean;
    createdAt: Date;
    bootcamp: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
}
interface ICourseModel extends Model<ICourse> {
    getAverageCost(bootcampId: Schema.Types.ObjectId): Promise<void>;
}
const CourseSchema = new Schema<ICourse, ICourseModel>({
    title: {
        type: String,
        trim: true,
        require: [true, "Please add a course title"],
    },
    description: {
        type: String,
        require: [true, "Please add a course description"],
    },
    weeks: {
        type: String,
        require: [true, "Please add number of weeks"],
    },
    tuition: {
        type: Number,
        require: [true, "Please add a course tuition"],
    },
    minimumSkill: {
        type: String,
        require: [true, "Please add a minimum skill"],
        enum: ["beginner", "intermediate", "advanced"],
    },
    scholarshipsAvailable: {
        type: Boolean,
        default: false,
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

CourseSchema.static("getAverageCost", async function (bootcampId: Schema.Types.ObjectId) {
    const aggregate = await this.aggregate([
        {
            $match: {
                bootcamp: bootcampId,
            },
        },
        {
            $group: {
                _id: "$bootcamp",
                averageCost: {
                    $avg: "$tuition",
                },
            },
        },
    ]);
    const averageCost = aggregate[0]?.averageCost ?? 0;
    try {
        await BootcampModel.findByIdAndUpdate(bootcampId, {
            averageCost: Number(averageCost).toFixed(2),
        });
    } catch (error) {
        console.log(`Error when updating bootcamp with average cost ${error}`);
    }
});

// Call getAverageCost after save
CourseSchema.post("save", function (this: ICourse) {
    CourseModel.getAverageCost(this.bootcamp);
});

// Call getAverageCost after deleteOne
CourseSchema.pre("deleteOne", { document: true }, function (this: ICourse) {
    CourseModel.getAverageCost(this.bootcamp);
});

export const CourseModel = mongoose.model<ICourse, ICourseModel>("Course", CourseSchema);
