import Report from '../models/Report.js';

export const createReport = async (req, res) => {
  try {
    const { type, location, description } = req.body;
    if (!type || !location) {
      return res.status(400).json({ error: 'Type and location are required' });
    }
    const report = await Report.create({
      userId: req.user._id,
      type,
      location,
      description
    });
    
    // Emit via socket if available
    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('newReport', report);
    }
    
    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
};

export const getActiveReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: 'active' }).populate('userId', 'name').sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};
