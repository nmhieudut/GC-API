import { requestErrorMessage } from 'constants/error';
import mongoose from 'mongoose';
import { isVietnamesePhoneNumber } from 'utils/validate';
import { Auction } from './Auction';
import { Bid } from './Bid';
import { Campaign } from './Campaign';
import { Comment } from './Comment';
import { Donation } from './Donation';
import { Transaction } from './Transaction';

const userSchema = new mongoose.Schema(
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
      default: '',
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
    },
    isActive: {
      type: Boolean,
      default: true
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
  next();
});

userSchema.pre('remove', async function (next) {
  let user = this;
  const userId = user._id;
  await Comment.deleteMany({ author: userId });
  await Campaign.deleteMany({ author: userId });
  await Transaction.deleteMany({ author: userId });
  await Auction.deleteMany({ author: userId });
  await Donation.deleteMany({ author: userId });
  await Bid.deleteMany({ author: userId });
  next();
});

const User = mongoose.model('User', userSchema);

export { User };
