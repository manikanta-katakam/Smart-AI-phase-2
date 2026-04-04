import Policy from '../models/Policy.js';
import User from '../models/User.js';
import axios from 'axios';

export const calculatePremium = async (req, res) => {
  try {
    const { coverage } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let riskScore = 0.5;
    try {
      const { data } = await axios.post(`${process.env.AI_SERVICE_URL}/predict-risk`, {
        location: user.location || { lat: 0, lng: 0 },
        weather: 'clear'
      });
      if (data && data.riskScore) riskScore = data.riskScore;
    } catch (e) {
      console.log('AI service unavailable, using default risk score: ', e.message);
    }

    const base = coverage * 0.05;
    const riskFactor = (riskScore * 100); 
    const trustDiscount = (user.trustScore / 100) * 50; 
    
    let premium = base + riskFactor - trustDiscount;
    if (premium < 10) premium = 10;

    res.json({ premium: Math.round(premium), riskScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPolicy = async (req, res) => {
  try {
    const { premium, coverage } = req.body;
    
    // Inactivate old policies
    await Policy.updateMany({ userId: req.user._id }, { active: false });

    const policy = await Policy.create({
      userId: req.user._id,
      premium,
      coverage,
      active: true
    });
    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({ userId: req.user._id, active: true });
    if (policy) {
      res.json(policy);
    } else {
      res.status(404).json({ message: 'No active policy found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
