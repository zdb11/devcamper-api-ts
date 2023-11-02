import jwt from "jsonwebtoken";
import { asyncHandler } from "./async.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { IUserDocument, UserModel } from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import sanitizedConfig from "../config/config.js";
// Protect routes
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1] || "";
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (token === "") {
        return next(new ErrorResponse("Not authorize to access this route", 401));
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, sanitizedConfig.JWT_SECRET) as jwt.JwtPayload;
        const user: IUserDocument | null = await UserModel.findById(decoded.id);
        if (user === null) {
            return next(new ErrorResponse("Not authorize to access this route", 401));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorize to access this route", 401));
    }
});

// Grant access to specific roles
export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role ?? "")) {
            return next(new ErrorResponse(`User role '${req.user?.role}' is unauthorized to access this route`, 403));
        }
        next();
    };
};
