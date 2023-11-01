import mongoose, { Model, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sanitizedConfig from "../config/config.js";

interface IUser {
    name: string;
    email: string;
    role: string;
    password: string;
    resetPasswordToken: string;
    resetPasswordExpire: Date;
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
}

// eslint-disable-next-line no-use-before-define
export interface IUserDocument extends IUser, IUserMethods {}

type TUserModel = Model<IUser, object, IUserMethods>;

const UserSchema = new Schema<IUser, TUserModel, IUserMethods>({
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
UserSchema.method("getSignedJwtToken", function () {
    return jwt.sign({ id: this._id }, sanitizedConfig.JWT_SECRET, {
        expiresIn: sanitizedConfig.JWT_EXPIRE,
    });
});
UserSchema.method("matchPassword", async function (enteredPassword: string) {
    return await bcryptjs.compare(enteredPassword, this.password);
});
UserSchema.pre("save", async function () {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
});

export const UserModel = mongoose.model<IUser, TUserModel>("User", UserSchema);
