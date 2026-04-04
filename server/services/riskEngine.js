import { GoogleGenerativeAI } from "@google/generative-ai";
import Transaction from '../models/Transaction.js';

export const evaluateRisk = async (weatherData, io, userId) => {
  const { temp, condition, city } = weatherData;
  let riskLevel = 'LOW';
  let triggerAlert = false;
  let message = '';

  // 1. Basic Threshold Logic
  if (temp > 40) {
    riskLevel = 'HIGH';
    triggerAlert = true;
    message = `🔴 Critical: Extreme Heat detected in ${city}. 40°C threshold breached.`;
  } else if (condition.includes('Rain') || condition.includes('Storm')) {
    riskLevel = 'MEDIUM';
    triggerAlert = true;
    message = `🌧️ Warning: Precipitation detected in ${city}. Slippery conditions expected.`;
  }

  // 2. Emit Socket.io Alert if triggered
  if (triggerAlert && io) {
    io.emit('riskAlert', {
      level: riskLevel,
      message,
      timestamp: new Date()
    });

    // 3. Simulate Payout if HIGH risk
    if (riskLevel === 'HIGH' && userId) {
      const payoutAmount = 500;
      
      // Store in MongoDB
      try {
        const newTx = new Transaction({
          userId,
          amount: payoutAmount,
          reason: `Heat Alert in ${city}`,
          razorpayId: `sim_${Math.random().toString(36).substr(2, 9)}`
        });
        await newTx.save();
        
        io.emit('payoutTriggered', {
          amount: payoutAmount,
          reason: 'Extreme Weather Threshold Met',
          message: `₹${payoutAmount} credited to wallet due to climate disruption in ${city}.`
        });
      } catch (err) {
        console.error("Payout Saving Error:", err);
      }
    }
  }

  return riskLevel;
};

export const getAIPrediction = async (weatherData) => {
  const { temp, condition, city } = weatherData;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `As a parametric insurance AI, analyze this environment: ${city}, ${temp}°C, ${condition}. Predict the next-day risk as LOW, MEDIUM, or HIGH and provide a brief 1-sentence logic for the prediction. Format: Risk: [Level] | Note: [Your sentence].`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini AI Quota/Error:", err.message);
    return `Risk: LOW | Note: Predictive analytics currently in maintenance mode for ${city}. Normal safeguards remain active.`;
  }
};
