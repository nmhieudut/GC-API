import mongoose from 'mongoose';

const chargeHistorySchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

const ChargeHistory = mongoose.model('ChargeHistory', chargeHistorySchema);

export { ChargeHistory };
