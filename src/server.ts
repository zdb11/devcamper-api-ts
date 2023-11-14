import express, { type Express } from "express";
import morgan from "morgan";
import path from "path";
import * as url from "url";
import cookieParser from "cookie-parser";
import fileupload from "express-fileupload";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import ExpressXssSanitizer from "express-xss-sanitizer";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import config from "./config/config.js";
import { connectDB } from "./database/mongo.js";
import { errorHandler } from "./middleware/error.js";
import { EmailManager } from "./utils/EmailManager.js";
import { bootcampRouter } from "./routes/bootcamps.js";
import { coursesRouter } from "./routes/courses.js";
import { authRouter } from "./routes/auth.js";
import { userRoutes } from "./routes/users.js";
import { reviewRouter } from "./routes/review.js";
const __dirname: string = url.fileURLToPath(new URL(".", import.meta.url));
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

// Sanitize data
app.use(ExpressMongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(ExpressXssSanitizer.xss());

// Rate limiting
const limiter: RateLimitRequestHandler = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    limit: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

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
export const eManager: EmailManager = new EmailManager();

try {
    console.log("Preparing database connection.");
    await connectDB();
    app.listen(config.PORT, () => {
        console.log(`[Server]: Server is runnning at http://localhost:${config.PORT}`);
    });
} catch (error) {
    console.log(`Server won't start becasue of error: ${error}`);
}
