import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['flood', 'roadblock', 'other'] },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
