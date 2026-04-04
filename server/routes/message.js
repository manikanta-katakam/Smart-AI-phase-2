import express from 'express';
import { getMessages, getAllMessages } from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversation', protect, getMessages);
router.get('/', protect, admin, getAllMessages);

export default router;
