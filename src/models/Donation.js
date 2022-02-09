import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    campaignId: {
      type: String
    },
    amount: {
      type: Number
    },
    message: {
      type: String
    },
    action: {
      type: String,
      required: true
    },
    donatedType: {
      type: String,
      default: 'donation'
    },
    lastBalance: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export const Donation = mongoose.model('Donation', donationSchema);
