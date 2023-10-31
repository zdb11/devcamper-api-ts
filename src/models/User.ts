import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sanitizedConfig from "../config/config.js";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/, "Please add a valid email"],
        },
        role: {
            type: String,
            enum: ["user", "publisher"],
            default: "user",
        },
        password: {
            type: String,
            required: [true, "Please add a password"],
            minlength: 6,
            select: false,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        confirmEmailToken: String,
        isEmailConfirmed: {
            type: Boolean,
            default: false,
        },
        twoFactorCode: String,
        twoFactorCodeExpire: Date,
        twoFactorEnable: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        methods: {
            getSignedJwtToken() {
                return jwt.sign({ id: this._id }, sanitizedConfig.JWT_SECRET, {
                    expiresIn: sanitizedConfig.JWT_EXPIRE,
                });
            },
            async matchPassword(enteredPassword: string) {
                return await bcryptjs.compare(enteredPassword, this.password);
            },
        },
    }
);

UserSchema.pre("save", async function () {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

export const UserModel = mongoose.model("User", UserSchema);
