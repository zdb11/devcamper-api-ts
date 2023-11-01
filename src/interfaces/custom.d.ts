import { AdvancedResult } from "./interfaces.ts";
import { IUserDocument } from "../models/User.js";

declare global {
    namespace Express {
        export interface Response {
            advancedResult?: AdvancedResult;
        }
        export interface Request {
            user?: IUserDocument;
        }
    }
}
