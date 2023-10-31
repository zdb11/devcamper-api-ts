import { UserModel } from "../models/User.js";
import { asyncHandler } from "../middleware/async.js";
import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse.js";

// @desc        Register user
// @route       POST /api/v1/auth/register
// @access      Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await UserModel.create({
        name,
        email,
        password,
        role,
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ status: true, token });
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
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ status: true, token });
});
