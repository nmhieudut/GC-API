import mongoose from "mongoose";

export const walletSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    amount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export { Wallet };
