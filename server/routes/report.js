import express from 'express';
import { createReport, getActiveReports } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReport);
router.get('/active', protect, getActiveReports);

export default router;
