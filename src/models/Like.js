import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      required: [true, "Comment must have content"]
    },
    commentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);

export { Like };
