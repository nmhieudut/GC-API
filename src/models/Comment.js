import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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

export const Comment = mongoose.model("Comment", commentSchema);
