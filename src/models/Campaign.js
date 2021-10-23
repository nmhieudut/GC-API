import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Campaign must have name"]
    },
    image: {
      type: String,
      required: [true, "Campaign must have at least one picture"]
    },
    status: {
      type: String,
      required: true,
      default: "pending"
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Campaign must have content"]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    finishedAt: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    donated_amount: {
      type: Number,
      required: true,
      default: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    comment_ids: {
      type: Array,
      default: []
    },
    donators: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Donator"
        }
      ]
    }
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

export { Campaign };
