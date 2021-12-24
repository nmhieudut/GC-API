import mongoose, { Schema } from 'mongoose';

const bidSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    auctionId: {
      type: String
    },
    amount: {
      type: Number,
      min: 0
    }
  },
  { timestamps: true }
);

const Bid = mongoose.model('Bid', bidSchema);

export { Bid };
