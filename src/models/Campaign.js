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
    slug: {
      type: String,
      trim: true,
      required: [true, "Campaign must have slug"]
    },
    status: {
      type: String,
      required: true,
      default: "pending"
    },
    content: {
      type: String,
      unique: true,
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
    }
  },
  { timestamps: true }
);

campaignSchema.pre("deleteOne", async function (next) {
  let campaign = this;
  const campaignId = campaign._conditions._id;
  await Comment.deleteMany({ campaignId });
  next();
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export { Campaign };
