import { UserModel } from "../models/User.js";
import { asyncHandler } from "../middleware/async.js";
import { Request, Response } from "express";

// @desc        Register user
// @route       GET /api/v1/auth/register
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
