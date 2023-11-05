import express, { type Express } from "express";
import { bootcampRouter } from "./routes/bootcamps.js";
import { coursesRouter } from "./routes/courses.js";
import { authRouter } from "./routes/auth.js";
import morgan from "morgan";
import config from "./config/config.js";
import { connectDB } from "./database/mongo.js";
import { errorHandler } from "./middleware/error.js";
import fileupload from "express-fileupload";
import cookieParser from "cookie-parser";
import path from "path";
import * as url from "url";
import { EmailManager } from "./utils/EmailManager.js";
import { userRoutes } from "./routes/users.js";
import { reviewRouter } from "./routes/review.js";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app: Express = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (config.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRouter);

// Error handling middleware
app.use(errorHandler);

// Creating email manager
export const eManager = new EmailManager();

try {
    console.log("Preparing database connection.");
    await connectDB();
    app.listen(config.PORT, () => {
        console.log(`[Server]: Server is runnning at http://localhost:${config.PORT}`);
    });
} catch (error) {
    console.log(`Server won't start becasue of error: ${error}`);
}
