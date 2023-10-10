import express, { type Express } from "express";
import { bootcampRouter } from "./routes/bootcamps.js";
import { coursesRouter } from "./routes/courses.js";
import morgan from "morgan";
import config from "./config/config.js";
import { connectDB } from "./database/mongo.js";
import { errorHandler } from "./middleware/error.js";

const app: Express = express();
app.use(express.json());
if (config.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", coursesRouter);
app.use(errorHandler);
try {
    console.log("Preparing database connection.");
    await connectDB();
    app.listen(config.PORT, () => {
        console.log(`[Server]: Server is runnning at http://localhost:${config.PORT}`);
    });
} catch (error) {
    console.log(`Server won't start becasue of error: ${error}`);
}
