import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    orderId: {
      type: String
    },
    amount: {
      type: Number
    },
    method: {
      type: String
    },
    action: {
      type: String
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export { Transaction };
