import mongoose from "mongoose";
import config from "../config/config.js";
export const connectDB = async (): Promise<void> => {
    const connector = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected: ${connector.connection.host}`);
};
