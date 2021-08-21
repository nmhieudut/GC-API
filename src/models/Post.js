import mongoose from "mongoose";
import { userSchema } from "./User";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: [true, "Post must have content"]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    likes: {
      type: [userSchema],
      default: []
    },
    comments: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export { Post };
