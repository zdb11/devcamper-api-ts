import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";
export const authRouter = express.Router();
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getMe);
