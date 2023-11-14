declare module "express-xss-sanitizer" {
    import { RequestHandler } from "express";

    interface XssOptions {
        allowedTags?: string[];
        allowedKeys?: string[];
    }

    interface ExpressXssSanitizer {
        xss(options?: XssOptions): RequestHandler;
        sanitize(input: string): string;
    }

    const ExpressXssSanitizer: ExpressXssSanitizer;

    export default ExpressXssSanitizer;
}
