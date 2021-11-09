import { BankAccount } from "models/Wallet";
import { User } from "models/User";
import { errorMessage } from "constants/error";

export const userController = {
  getMany: async (req, res, next) => {
    try {
    } catch (e) {
      next(e);
    }
  },
  update: async (req, res, next) => {
    try {
      const { userId, isAdmin } = req.user;
      const foundUser = await User.findOne({ _id: userId });
      if (
        userId === String(foundUser._id) ||
        (userId !== String(foundUser._id) && isAdmin === true)
      ) {
        const user = await User.findByIdAndUpdate(userId, req.body, {
          new: true,
          runValidator: true
        });
        return res.status(200).json({
          user: {
            id: user._id,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            name: user.name,
            picture: user.picture,
            isAdmin: user.isAdmin
          }
        });
      }
      const err = new Error(errorMessage.FORBIDDEN);
      err.statusCode = 403;
      return next(err);
    } catch (e) {
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      const { userId, isAdmin } = req.body;
      await User.deleteOne({ _id: userId });
      res.status(200).json({
        message: "OK"
      });
    } catch (e) {
      next(e);
    }
  }
};
