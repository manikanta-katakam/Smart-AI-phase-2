import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  premium: { type: Number, required: true },
  coverage: { type: Number, required: true },
  active: { type: Boolean, default: true },
  aiExplanation: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Policy', policySchema);
