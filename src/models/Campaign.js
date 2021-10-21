import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Campaign must have name"]
    },
    image: {
      type: [String],
      required: [true, "Campaign must have at least one picture"]
    },
    status: {
      type: Boolean,
      required: true,
      default: false
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
    finished_date: {
      type: Date,
      required: true
    },
    bank_account_number: {
      type: String,
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
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
        }
      ],
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
