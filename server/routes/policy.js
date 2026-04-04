import express from 'express';
import { calculatePremium, createPolicy, getMyPolicy } from '../controllers/policyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { policySchema } from '../validators/schema.js';

const router = express.Router();

router.post('/calculate', protect, validate(policySchema), calculatePremium);
router.post('/', protect, validate(policySchema), createPolicy);
router.get('/', protect, getMyPolicy);

export default router;
