import mongoose from "mongoose";

export const bankAccountSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    accountNumber: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Vui lòng nhập số tài khoản"]
    },
    accountName: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Vui lòng nhập tên chủ tài khoản"]
    },
    address: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Vui lòng nhập chi nhánh"]
    }
  },
  { timestamps: true }
);

const BankAccount = mongoose.model("BankAccount", userSchema);

export { BankAccount };
