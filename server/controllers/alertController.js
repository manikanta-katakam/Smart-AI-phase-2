import Alert from '../models/Alert.js';

export const sendAlert = async (req, res) => {
  try {
    const { type, message, zone, userId } = req.body;
    
    const alert = await Alert.create({
      type,
      message,
      zone,
      userId
    });

    // Access io from the app instance
    if (req.app.get('io')) {
      req.app.get('io').emit('newAlert', alert);
    }

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const triggerSOS = async (req, res) => {
  try {
    const { location } = req.body;
    
    const sosAlert = await Alert.create({
      type: 'sos',
      message: `Emergency SOS triggered by ${req.user.name}`,
      userId: req.user._id,
      zone: location ? `${location.lat},${location.lng}` : 'Unknown'
    });

    if (req.app.get('io')) {
      req.app.get('io').emit('sosAlert', sosAlert);
    }

    res.status(201).json(sosAlert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
