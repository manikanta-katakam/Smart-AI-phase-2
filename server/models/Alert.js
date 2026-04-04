import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['rain', 'heat', 'pollution', 'flood', 'road block', 'announcement', 'sos'] },
  message: { type: String, required: true },
  zone: { type: String }, // Optional, global if generic
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, for directed alerts or SOS origin
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);
