import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    campaignId: {
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

export const Comment = mongoose.model("Comment", commentSchema);
