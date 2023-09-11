import type { Request, Response, NextFunction } from 'express';
import { BootcampModel } from '../models/Bootcamp.js';

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
export const getBootcamps = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamps = await BootcampModel.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        console.log(`Error from GET /api/v1/bootcamps :${error}`);
        res.status(400).json({ success: false });
    }
};

// @desc        Get single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
export const getBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await BootcampModel.findById(req.params.id);
        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (error) {
        console.log(`Error from GET /api/v1/bootcamps/:id :${error}`);
        res.status(400).json({ success: false });
    }
};

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
export const createBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await BootcampModel.create(req.body);
        res.status(201).json({ success: true, data: bootcamp });
    } catch (error) {
        console.log(`Error from POST /api/v1/bootcamps :${error}`);
        res.status(400).json({ success: false });
    }
};

// @desc        Update bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
export const updateBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await BootcampModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (error) {
        console.log(`Error from PUT /api/v1/bootcamps/:id :${error}`);
        res.status(400).json({ success: false });
    }
};

// @desc        Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
export const deleteBootcamp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
        if (!bootcamp) {
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.log(`Error from DELETE /api/v1/bootcamps/:id :${error}`);
        res.status(400).json({ success: false });
    }
};
