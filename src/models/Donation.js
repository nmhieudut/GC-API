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
    }
  },
  { timestamps: true }
);

export const Donation = mongoose.model('Donation', donationSchema);
