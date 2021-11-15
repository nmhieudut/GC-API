import mongoose from 'mongoose';

export const walletSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    balance: {
      type: Number,
      default: 0
    },
    deleted_at: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const Wallet = mongoose.model('Wallet', walletSchema);

export { Wallet };
