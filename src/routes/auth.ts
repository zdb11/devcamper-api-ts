import express from "express";
import { registerUser } from "../controllers/auth.js";

export const authRouter = express.Router();
authRouter.post("/register", registerUser);
