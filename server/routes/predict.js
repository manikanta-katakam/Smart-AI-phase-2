import express from 'express';
import { getPrediction } from '../controllers/predictController.js';

const router = express.Router();

router.get('/', getPrediction);

export default router;
