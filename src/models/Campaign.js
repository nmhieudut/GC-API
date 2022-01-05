import mongoose from 'mongoose';
import { Auction } from './Auction';
import { Comment } from './Comment';
import { Donation } from './Donation';

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Campaign must have name']
    },
    images: {
      type: [String],
      required: [true, 'Campaign must have at least one picture']
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Campaign must have slug']
    },
    status: {
      type: String,
      required: true,
      default: 'pending'
    },
    content: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Campaign must have content']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    finishedAt: {
      type: Date,
      required: true
    },
    goal: {
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
      ref: 'Category'
    }
  },
  { timestamps: true }
);

campaignSchema.pre('remove', async function (next) {
  let campaign = this;
  const campaignId = campaign._id;
  await Comment.deleteMany({ campaignId });
  await Donation.deleteMany({ campaignId });
  await Auction.deleteMany({ campaign: campaignId });
  next();
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export { Campaign };
