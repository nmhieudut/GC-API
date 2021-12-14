import mongoose from 'mongoose';

const auctionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    description: {
      type: String
    },
    startedAt: {
      type: Date,
      required: true
    },
    finishedAt: {
      type: Date,
      required: true
    },
    startAmount: {
      type: Number,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    enabled: {
      type: Boolean,
      default: false
    },
    currentBid: {
      type: Bid.schema,
      required: false
    },
    countdown: { type: Number, default: 1 },
    bids: [Bid.schema]
  },
  { timestamps: true }
);

const Auction = mongoose.model('Auction', auctionSchema);

export { Auction };
