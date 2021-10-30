import mongoose from "mongoose";

export const walletSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    amount: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Vui lòng nhập tên chủ tài khoản"]
    }
  },
  { timestamps: true }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export { Wallet };
