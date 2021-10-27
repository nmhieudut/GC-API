import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { isVietnamesePhoneNumber } from "utils/validate";
export const userSchema = new mongoose.Schema(
  {
    picture: {
      type: String,
      default: "https://picsum.photos/200/300"
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Vui lòng nhập tên"]
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Vui lòng nhập email"]
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Vui lòng nhập password"],
      minlength: [6, "Mật khẩu ít nhất 6 chữ cái"]
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: null,
      minlength: [9, "Số điện thoại không được ít hơn 9 chữ số"],
      maxlength: [11, "Số điện thoại không được nhiềuv hơn 11 chữ số"]
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
      const err = new Error("Số điện thoại không khả dụng");
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
