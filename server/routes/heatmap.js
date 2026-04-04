import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Simulated Risk Heatmap Data for around the user's city
// In production, this would look up historical/near-real-time accident or environmental hazard data
router.get('/', protect, (req, res) => {
  const { lat, lon } = req.query;
  const latitude = parseFloat(lat) || 28.6139;
  const longitude = parseFloat(lon) || 77.2090;

  // Generate 20 pseudo-random risk points near current location with varied intensities
  const points = [];
  for (let i = 0; i < 20; i++) {
    points.push([
      latitude + (Math.random() - 0.5) * 0.1,
      longitude + (Math.random() - 0.5) * 0.1,
      Math.random() * 0.8 + 0.2 // Intensity [0.2 - 1.0]
    ]);
  }

  res.json({
    points,
    updatedAt: new Date(),
    source: 'SmartShield Satellite Network'
  });
});

export default router;
