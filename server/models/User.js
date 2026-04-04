import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['worker', 'admin'], default: 'worker' },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  trustScore: { type: Number, default: 100 },
  wallet: {
    balance: { type: Number, default: 0 },
    totalPremiumPaid: { type: Number, default: 0 },
    totalClaimsReceived: { type: Number, default: 0 }
  },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  trustScoreDetails: {
    behavior: { type: Number, default: 100 },
    gpsConsistency: { type: Number, default: 100 },
    claimFrequency: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
