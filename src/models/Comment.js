import mongoose from "mongoose";
import { userSchema } from "./User";

export const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, "Comment must have content"]
    },
    commentor: {
      type: mongoose.Schema.Types.ObjectId,
      type: [userSchema],
      required: [true, "Comment must belong to a commentor"]
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export { Comment };
