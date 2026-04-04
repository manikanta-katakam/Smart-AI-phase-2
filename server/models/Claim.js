import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  triggerType: { type: String, required: true, enum: ['weather', 'curfew', 'pollution', 'flood', 'road block', 'other'] },
  payout: { type: Number, required: true },
  status: { type: String, enum: ['processed', 'pending', 'rejected'], default: 'pending' },
  aiExplanation: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Claim', claimSchema);
