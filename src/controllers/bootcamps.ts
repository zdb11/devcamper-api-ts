import type { Request, Response, NextFunction } from "express";
import { BootcampModel } from "../models/Bootcamp.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";
import { geocoder } from "../utils/geocoder.js";
import { UploadedFile } from "express-fileupload";
import sanitizedConfig from "../config/config.js";
import path from "path";

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
export const getBootcamps = asyncHandler(async (req: Request, res: Response) => {
    const reqQuery = { ...req.query };

    // Special keywords
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((field) => delete reqQuery[field]);

    // Query regex
    const queryString = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in")\b/g, (match) => `$${match}`);

    const query = BootcampModel.find(JSON.parse(queryString)).populate("courses");

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
    const total = await BootcampModel.countDocuments();

    query.skip(startIndex).limit(limit);

    // Pagination result
    const pagination = { next: {}, prev: {} };
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
    const bootcamps = await query;
    res.status(200).json({ success: true, count: bootcamps.length, pagination: pagination, data: bootcamps });
});

// @desc        Get single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
export const getBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
export const createBootcamp = asyncHandler(async (req: Request, res: Response) => {
    const bootcamp = await BootcampModel.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
});

// @desc        Update bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
export const updateBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc        Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
export const deleteBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});

// @desc        Get bootcamps within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
export const getBootcampsInRadius = asyncHandler(async (req: Request, res: Response) => {
    const { zipcode, distance } = req.params;
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = (distance as unknown as number) / 6378 || 0;
    const bootcamps = await BootcampModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius],
            },
        },
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});

// @desc        Upload photo for bootcamp
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private
export const uploadBootcampUpload = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file as UploadedFile;

    // Check if file is image
    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check file size
    if (file.size > sanitizedConfig.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${sanitizedConfig.MAX_FILE_UPLOAD}`, 400));
    }

    // Create custom filename
    file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`;

    // Save image file to server
    file.mv(`${sanitizedConfig.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse("Problem with file upload", 500));
        }
        await BootcampModel.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({ success: true, data: file.name });
    });
});
