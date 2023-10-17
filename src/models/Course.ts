import mongoose, { Schema } from "mongoose";
import { BootcampModel } from "./Bootcamp.js";

const CourseSchema = new Schema(
    {
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
    },
    {
        statics: {
            async getAverageCost(bootcampId: mongoose.Types.ObjectId) {
                console.log("Calculating avg cost..");
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
            },
        },
    }
);

// Call getAverageCost after save
CourseSchema.post("save", function () {
    // Can't find any other workaround than just ts-ignore
    // @ts-ignore
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after deleteOne
CourseSchema.pre("deleteOne", { document: true }, function () {
    // Can't find any other workaround than just ts-ignore
    // @ts-ignore
    this.constructor.getAverageCost(this.bootcamp);
});

export const CourseModel = mongoose.model("Course", CourseSchema);
