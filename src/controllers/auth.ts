import { UserModel, IUserDocument } from "../models/User.js";
import { asyncHandler } from "../middleware/async.js";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse.js";
import sanitizedConfig from "../config/config.js";
import { Result } from "../interfaces/interfaces.js";
import { Options } from "nodemailer/lib/mailer/index.js";
import { eManager } from "../server.js";
import crypto from "crypto";

// @desc        Register user
// @route       POST /api/v1/auth/register
// @access      Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user: IUserDocument = await UserModel.create({
        name,
        email,
        password,
        role,
    });

    // Send token
    sendTokenResponse(user, 200, res);
});

// @desc        Login user
// @route       POST /api/v1/auth/login
// @access      Public
export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    // Check for user
    const user: IUserDocument = await UserModel.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }
    user.getSignedJwtToken();
    // Check if password matches
    const isMatch: boolean = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Send token
    sendTokenResponse(user, 200, res);
});

// @desc        Get current logged in user
// @route       POST /api/v1/auth/me
// @access      Private
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user: IUserDocument | null = await UserModel.findById(req.user?._id);
    if (user === null) {
        return next(new ErrorResponse("No user found for this header value", 404));
    }
    const result: Result = {
        success: true,
        data: user as object,
    };
    res.status(200).json(result);
});

// @desc        Forgot password
// @route       POST /api/v1/auth/forgotpassword
// @access      public
export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user: IUserDocument | null = await UserModel.findOne({ email: req.body.email });
    if (user === null) {
        return next(new ErrorResponse("No user found for this email", 404));
    }

    // Get reset token
    const resetToken: string = user.getResetPasswordToken();

    user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl: string = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;

    const message: string = `You are receiving this email because you (or someone else) has requested the reset of a password. To reset password please open link: \n\n ${resetUrl}`;
    const options: Options = {
        to: user.email,
        subject: "Password reset token",
        text: message,
    };
    try {
        await eManager.sendEmail(options);
        const result: Result = {
            success: true,
            data: { message: "Email sent" },
        };
        res.status(200).json(result);
    } catch (error) {
        console.log(`Error when sending email: ${error}`);
        // Restarting tokens
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse("Email could not be sent", 500));
    }
});

// @desc        Reset password
// @route       GET /api/v1/auth/resetpassword/:resettoken
// @access      Private
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex");

    const user: IUserDocument | null = await UserModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (user === null) {
        return next(new ErrorResponse("Invalid token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send token
    sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user: IUserDocument, statusCode: number, res: Response) => {
    // Create token
    const token: string = user.getSignedJwtToken();
    const options: CookieOptions = {
        expires: new Date(Date.now() + sanitizedConfig.JWT_COOKIE_EXPIRE * 24 * 60 * 1000),
        httpOnly: true,
    };

    if (sanitizedConfig.NODE_ENV == "production") {
        options.secure = true;
    }
    res.status(statusCode).cookie("token", token, options).json({ success: true, token });
};
