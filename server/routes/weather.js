import express from 'express';
import { getWeatherData } from '../controllers/weatherController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getWeatherData);

export default router;
