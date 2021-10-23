import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: String
    },
    userAvatar: {
      type: String
    },
    postId: {
      type: String
    },
    text: {
      type: String,
      trim: true,
      max: 500,
      required: [true, "Comment must have content"]
    }
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", donationSchema);
