import {type Request, Response, NextFunction} from 'express'
import { ErrorResponse } from '../utils/errorResponse.js';
import { CastError, Error } from 'mongoose';
import { MongoServerError } from 'mongodb';
export const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    let error = {...err};
    if (err.name === 'CastError') {
        error = new ErrorResponse(`Bad format of requested id ${(err as unknown as CastError).value}`, 404);
    } else if ((err as unknown as MongoServerError).code === 11000) {
        error = new ErrorResponse('Duplicate field value entered.', 400);
    } else if (err.name === 'ValidationError') {
        error = new ErrorResponse(Object.values((err as unknown as Error.ValidationError).errors).map(val => val.message).toString(), 400)
    }
    
    res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'})
}