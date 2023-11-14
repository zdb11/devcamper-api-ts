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
    const responseData = res.advancedResult;
    res.status(200).json(responseData);
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
export const createBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Add user to req.body
    req.body.user = req.user?._id;

    // Check for published bootcamp
    const publishedBootcamp = await BootcampModel.findOne({ user: req.user?._id });

    // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user?.role !== "admin") {
        return next(new ErrorResponse(`The user with ID '${req.user?._id} has already published bootcamp'`, 400));
    }

    const bootcamp = await BootcampModel.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
});

// @desc        Update bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
export const updateBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user?.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
        return next(new ErrorResponse(`User '${req.user?._id}' is not authorized to update this bootcamp`, 401));
    }

    bootcamp = await BootcampModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc        Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
export const deleteBootcamp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamp = await BootcampModel.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user?.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
        return next(new ErrorResponse(`User '${req.user?._id}' is not authorized to delete this bootcamp`, 401));
    }

    await BootcampModel.deleteOne({ _id: req.params.id });

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
    // Make sure user is bootcamp owner
    if (bootcamp.user?.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
        return next(new ErrorResponse(`User '${req.user?._id}' is not authorized to update this bootcamp`, 401));
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
