import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
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

const History = mongoose.model('History', historySchema);

export { History };
