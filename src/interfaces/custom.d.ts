import { AdvancedResult } from "./interfaces.ts";
declare global {
    namespace Express {
        export interface Response {
            advancedResult?: AdvancedResult;
        }
    }
}
