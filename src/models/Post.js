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
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: []
    },
    comments: {
      type: [
        {
          comment: {
            type: String,
            trim: true,
            required: [true, "Comment must have content"]
          },
          commentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          }
        }
      ],
      default: []
    }
    // comments: {
    //   type: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Comment"
    //     }
    //   ],
    //   default: []
    // }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export { Post };
