export const getLiveRisk = async (req, res) => {
  const io = req.app.get('io');
  
  const riskData = {
    weather: "Heavy Rain & Unstable Conditions",
    riskLevel: "HIGH",
    suggestion: "Avoid outdoor work & seek shelter immediately.",
    timestamp: new Date()
  };

  if (io) {
    io.emit("riskAlert", { message: "⚠️ HIGH RISK ALERT: Heavy rain reported in your zone." });
  }

  res.json(riskData);
};
