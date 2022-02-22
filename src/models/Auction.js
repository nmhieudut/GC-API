import mongoose, { Schema } from 'mongoose';
import { Bid } from './Bid';

const auctionSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    images: [String],
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign'
    },
    description: {
      type: String
    },
    finishedAt: {
      type: Date,
      required: true
    },
    startPrice: {
      type: Number,
      default: 0,
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      required: true
    },
    status: {
      type: String,
      default: 'active'
    },
    result: {
      type: String,
      default: null
    },
    currentBid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid',
      default: null
    },
    bids: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Bid'
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

auctionSchema.pre('remove', async function (next) {
  let auction = this;
  const auctionId = auction._id;
  await Bid.deleteMany({ auction: auctionId });
  next();
});

const Auction = mongoose.model('Auction', auctionSchema);

export { Auction };
