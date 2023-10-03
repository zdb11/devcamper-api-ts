import type { Request, Response, NextFunction } from 'express';
import { BootcampModel } from '../models/Bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { asyncHandler } from '../middleware/async.js';
import { geocoder } from '../utils/geocoder.js';

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
export const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort'];
    removeFields.forEach((field) => delete reqQuery[field]);

    const queryString = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in")\b/g, (match) => `$${match}`);

    let query = BootcampModel.find(JSON.parse(queryString));

    if (req.query.select) {
        const fields = (req.query.select as string).split(',').join(' ');
        query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = (req.query.sort as string).split(',').join(' ');
        query.sort(sortBy);
    } else {
        query.sort('-createdAt');
    }
    const bootcamps = await query;
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
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
export const getBootcampsInRadius = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
