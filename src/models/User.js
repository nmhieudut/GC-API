import mongoose from "mongoose";
import bcrypt from "bcrypt";
import isVietnamesePhoneNumber from "../utils/validate";
export const userSchema = new mongoose.Schema(
  {
    picture: {
      type: String
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Display name must be required"]
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      dropDups: true,
      required: [true, "Email must be required"]
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password must be required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: null,
      minlength: [9, "Phone number must be at least 9 characters"],
      maxlength: [11, "Phone number can not reach over 11 characters"]
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let user = this;
  if (user.phoneNumber) {
    if (!isVietnamesePhoneNumber(user.phoneNumber)) {
      const err = new Error("Phone number is invalid");
      err.statusCode = 400;
      return next(err);
    }
  }

  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export { User };
