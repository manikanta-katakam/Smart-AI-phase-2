import express from 'express';
import { getLiveRisk } from '../controllers/riskController.js';

const router = express.Router();

router.get('/live', getLiveRisk);

export default router;
