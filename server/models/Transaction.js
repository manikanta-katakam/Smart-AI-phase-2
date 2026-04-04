import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  type: { type: String, default: 'PAYOUT' },
  status: { type: String, default: 'COMPLETED' },
  reason: String,
  razorpayId: String,
  createdAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
