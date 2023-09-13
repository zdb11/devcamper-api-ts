import type { Request, Response, NextFunction } from 'express';
import { BootcampModel } from '../models/Bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { asyncHandler } from '../middleware/async.js';

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
export const getBootcamps = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const bootcamps = await BootcampModel.find();
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
