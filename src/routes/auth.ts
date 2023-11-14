import express from "express";
import {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword,
    updateUserDetails,
    updatePassword,
    logoutUser,
} from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";
export const authRouter = express.Router();
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getMe);
authRouter.get("/logout", protect, logoutUser);
authRouter.put("/updatedetails", protect, updateUserDetails);
authRouter.put("/updatepassword", protect, updatePassword);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.get("/resetpassword/:resettoken", resetPassword);
