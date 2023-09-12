import express, { type Router } from 'express';
import { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp } from '../controllers/bootcamps.js';

export const router: Router = express.Router();

router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);