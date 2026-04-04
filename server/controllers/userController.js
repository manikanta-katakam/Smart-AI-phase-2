import User from '../models/User.js';
import Claim from '../models/Claim.js';
import PDFDocument from 'pdfkit';

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      trustScore: user.trustScore,
      status: user.status
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.location) user.location = req.body.location;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      location: updatedUser.location,
      trustScore: updatedUser.trustScore,
      status: updatedUser.status
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const getAllWorkers = async (req, res) => {
  const workers = await User.find({ role: 'worker' }).select('-password');
  res.json(workers);
};

export const toggleWorkerStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user && user.role === 'worker') {
    user.status = user.status === 'active' ? 'blocked' : 'active';
    const updatedUser = await user.save();
    res.json({ message: `User status changed to ${updatedUser.status}`, user: updatedUser });
  } else {
    res.status(404).json({ message: 'Worker not found' });
  }
};
export const generateWorkerReport = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const claims = await Claim.find({ userId: user._id });

    const doc = new PDFDocument();
    let filename = `Worker_Report_${user.name.replace(/\s+/g, '_')}.pdf`;
    
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.fontSize(20).text('SmartShield AI - Worker Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Role: ${user.role}`);
    doc.text(`Trust Score: ${user.trustScore}`);
    doc.text(`Wallet Balance: ₹${user.wallet || 0}`);
    doc.text(`Location: ${user.location?.lat || 'N/A'}, ${user.location?.lng || 'N/A'}`);
    doc.text(`Status: ${user.status}`);
    
    doc.moveDown();
    doc.fontSize(16).text('Claims History', { underline: true });
    doc.moveDown(0.5);

    if (claims.length === 0) {
      doc.fontSize(12).text('No claims record found.');
    } else {
      claims.forEach((claim, index) => {
        doc.fontSize(12).text(`${index + 1}. Type: ${claim.triggerType} | Payout: ₹${claim.payout} | Status: ${claim.status} | Date: ${new Date(claim.createdAt).toLocaleDateString()}`);
      });
    }

    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
