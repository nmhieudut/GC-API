import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donatorId: {
      type: String
    },
    campaignId: {
      type: String
    },
    amount: {
      type: Number
    }
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", donationSchema);
