import mongoose, { Schema } from "mongoose";

const CourseSchema = new Schema({
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
});

export const CourseModel = mongoose.model("Course", CourseSchema);
