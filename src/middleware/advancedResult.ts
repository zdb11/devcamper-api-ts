import { NextFunction, Request, Response } from "express";
import { Model, PopulateOptions } from "mongoose";
import { PaginationResult } from "../interfaces/interfaces.js";
export const advancedResult =
    (model: typeof Model, populate?: PopulateOptions | (string | PopulateOptions)[]) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const reqQuery = { ...req.query };

        // Special keywords
        const removeFields = ["select", "sort", "page", "limit"];
        removeFields.forEach((field) => delete reqQuery[field]);

        // Query regex
        const queryString = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in")\b/g, (match) => `$${match}`);
        const query = model.find(JSON.parse(queryString));

        // Populate
        if (populate) {
            query.populate(populate);
        }

        // Select
        if (req.query.select) {
            const fields = (req.query.select as string).split(",").join(" ");
            query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = (req.query.sort as string).split(",").join(" ");
            query.sort(sortBy);
        } else {
            query.sort("-createdAt");
        }

        // Paginiation
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await model.countDocuments();

        query.skip(startIndex).limit(limit);

        // Pagination result
        const pagination: PaginationResult = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit: limit,
            };
        }

        // Executing query
        const result = await query;
        res.advancedResult = { success: true, count: result.length, pagination: pagination, data: result };
        next();
    };
