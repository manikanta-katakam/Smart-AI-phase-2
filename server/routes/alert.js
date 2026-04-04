import express from 'express';
import { sendAlert, getAlerts, triggerSOS } from '../controllers/alertController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, sendAlert);
router.get('/', protect, getAlerts);
router.post('/sos', protect, triggerSOS);

export default router;
