import Claim from '../models/Claim.js';
import Policy from '../models/Policy.js';

export const triggerClaim = async (req, res) => {
  try {
    const { triggerType, userId } = req.body;
    let targetUserId = userId || req.user._id;

    if (triggerType === 'demo_story') {
      let policy = await Policy.findOne({ userId: targetUserId, active: true });
      if (!policy) {
        policy = await Policy.create({ userId: targetUserId, premium: 150, coverage: 5000, aiExplanation: "Demo Provisioned" });
      }
      
      await Claim.deleteMany({ userId: targetUserId, triggerType: 'rain' });
      
      const claim = await Claim.create({
        userId: targetUserId,
        triggerType: 'rain',
        payout: Math.round(policy.coverage * 0.2),
        status: 'processed',
        aiExplanation: 'DEMO SEQUENCE: Hyper-localized flash flood detected. funds dispersed instantly.'
      });
      
      return res.status(201).json(claim);
    }

    // Fraud validation: check if active policy exists
    const activePolicy = await Policy.findOne({ userId: targetUserId, active: true });
    if (!activePolicy) {
      return res.status(400).json({ message: 'No active policy found. Claim rejected.' });
    }

    // Fraud validation: check if recent duplicate claim exists
    const recentClaim = await Claim.findOne({
      userId: targetUserId,
      triggerType,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // past 24 hrs
    });

    if (recentClaim) {
      return res.status(400).json({ message: 'Duplicate claim detected for this event in the last 24 hours.' });
    }

    // Auto-calculate payout
    let payoutPercent = 0.2;
    if (['flood', 'road block'].includes(triggerType)) payoutPercent = 0.5;

    const payout = Math.round(activePolicy.coverage * payoutPercent);

    const claim = await Claim.create({
      userId: targetUserId,
      triggerType,
      payout,
      status: 'processed'
    });

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
