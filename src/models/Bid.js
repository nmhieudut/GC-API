import mongoose from 'mongoose';

const bidSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId
    },
    value: {
      type: Number,
      min: 0
    },
    blocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Bid = mongoose.model('Bid', bidSchema);

export { Bid };
