import express from 'express';
import { getProfile, updateProfile, getAllWorkers, toggleWorkerStatus, generateWorkerReport } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.route('/workers')
  .get(protect, admin, getAllWorkers);

router.route('/:id/status')
  .put(protect, admin, toggleWorkerStatus);

router.route('/:id/report')
  .get(protect, admin, generateWorkerReport);

export default router;
