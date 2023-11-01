import { UserModel, IUserDocument } from "../models/User.js";
import { asyncHandler } from "../middleware/async.js";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse.js";
import sanitizedConfig from "../config/config.js";
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
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

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
