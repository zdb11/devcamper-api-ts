import mongoose, { Document, Model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sanitizedConfig from "../config/config.js";
import crypto from "crypto";

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    role: string;
    password: string;
    resetPasswordToken: string | undefined;
    resetPasswordExpire: Date | undefined;
    confirmEmailToken: string;
    isEmailConfirmed: boolean;
    twoFactorCode: string;
    twoFactorCodeExpire: Date;
    twoFactorEnable: boolean;
    createdAt: Date;
}
interface IUserMethods {
    getSignedJwtToken(): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
    getResetPasswordToken(): string;
}

// eslint-disable-next-line no-use-before-define
export interface IUserDocument extends IUser, IUserMethods {}

interface IUserModel extends Model<IUser, object, IUserMethods> {}

const UserSchema = new Schema<IUser, IUserModel, IUserMethods>({
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
});
UserSchema.method("getSignedJwtToken", function (): string {
    return jwt.sign({ id: this._id }, sanitizedConfig.JWT_SECRET, {
        expiresIn: sanitizedConfig.JWT_EXPIRE,
    });
});
UserSchema.method("matchPassword", async function (enteredPassword: string) {
    return await bcryptjs.compare(enteredPassword, this.password);
});
UserSchema.method("getResetPasswordToken", function (): string {
    // Generate token
    const resetToken: string = crypto.randomBytes(20).toString("hex");

    // Hash token set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
});
UserSchema.pre("save", async function (next: (err?: Error) => void): Promise<void> {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

export const UserModel = mongoose.model<IUser, IUserModel>("User", UserSchema);
