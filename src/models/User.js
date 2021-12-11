import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { isVietnamesePhoneNumber } from 'utils/validate';
import { Campaign } from './Campaign';
import { Comment } from './Comment';
import { bcryptService } from 'plugins/bcrypt';
import { requestErrorMessage } from 'constants/error';
import { History } from './History';

export const userSchema = new mongoose.Schema(
  {
    picture: {
      type: String,
      default: 'https://picsum.photos/200/300'
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Vui lòng nhập tên']
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Vui lòng nhập email']
    },
    dateOfBirth: {
      type: Date
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Vui lòng nhập password'],
      minlength: [6, 'Mật khẩu ít nhất 6 chữ cái']
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: null,
      minlength: [9, 'Số điện thoại không được ít hơn 9 chữ số'],
      maxlength: [11, 'Số điện thoại không được nhiềuv hơn 11 chữ số']
    },
    role: {
      type: String,
      default: 'user'
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  let user = this;
  if (user.phoneNumber) {
    if (!isVietnamesePhoneNumber(user.phoneNumber)) {
      const err = new Error(requestErrorMessage.INVALID_PHONE);
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

userSchema.pre('deleteOne', async function (next) {
  let user = this;
  const userId = user._conditions._id;
  await Comment.deleteMany({ author: userId });
  await Campaign.deleteMany({ author: userId });
  await History.deleteMany({ author: userId });
  next();
});

const User = mongoose.model('User', userSchema);

export { User };
