import { UserModel, IUserDocument } from "../models/User.js";
import { asyncHandler } from "../middleware/async.js";
import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse.js";
import { Result } from "../interfaces/interfaces.js";

// @desc        Get all users
// @route       GET /api/v1/users
// @access      Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(res.advancedResult);
});

// @desc        Get single user
// @route       GET /api/v1/users/:id
// @access      Private/Admin
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user: IUserDocument | null = await UserModel.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    const responseData: Result = { success: true, data: user as object };
    res.status(200).json(responseData);
});

// @desc        Create user
// @route       POST /api/v1/users
// @access      Private/Admin
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const user: IUserDocument | null = await UserModel.create(req.body);
    const responseData: Result = { success: true, data: user as object };
    res.status(201).json(responseData);
});

// @desc        Update user
// @route       PUT /api/v1/users/:id
// @access      Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user: IUserDocument | null = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    const responseData: Result = { success: true, data: user as object };
    res.status(200).json(responseData);
});

// @desc        Delete user
// @route       DELETE /api/v1/users/:id
// @access      Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user: IUserDocument | null = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    const responseData: Result = { success: true, data: {} };
    res.status(200).json(responseData);
});
