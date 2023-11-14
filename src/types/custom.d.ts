import { AdvancedResult } from "../interfaces/interfaces.ts";
import { IUserDocument } from "../models/User.ts";

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
