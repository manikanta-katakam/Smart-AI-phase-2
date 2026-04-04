export const getPrediction = async (req, res) => {
  const prediction = {
    nextRisk: "HIGH",
    probability: "78%",
    recommendation: "Upgrade to Premium Plan for immediate coverage",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  };

  res.json(prediction);
};
