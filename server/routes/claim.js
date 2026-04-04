import express from 'express';
import { triggerClaim, getMyClaims, getAllClaims } from '../controllers/claimController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/trigger', protect, triggerClaim);
router.get('/myclaims', protect, getMyClaims);
router.get('/', protect, admin, getAllClaims);

export default router;
