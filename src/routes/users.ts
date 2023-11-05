import express, { Router } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/users.js";
import { authorize, protect } from "../middleware/auth.js";
import { advancedResult } from "../middleware/advancedResult.js";
import { UserModel } from "../models/User.js";

export const userRoutes: Router = express.Router();

userRoutes.use(protect, authorize(["admin"]));

userRoutes.route("/").get(advancedResult(UserModel), getUsers).post(createUser);
userRoutes.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
