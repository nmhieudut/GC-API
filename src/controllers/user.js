import { BankAccount } from "models/Wallet";
import { User } from "models/User";
import { errorMessage } from "constants/error";

const getMany = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const { userId, isAdmin } = req.user;

    const { name, phoneNumber, dateOfBirth } = req.body;
    const foundUser = await User.findOne({ _id: userId });
    if (
      userId === String(foundUser._id) ||
      (userId !== String(foundUser._id) && isAdmin === true)
    ) {
      const user = await User.findByIdAndUpdate(
        userId,
        { name, phoneNumber, dateOfBirth },
        { new: true, runValidator: true }
      );
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
};

const remove = async (req, res, next) => {
  try {
    const { userId, isAdmin } = req.body;
    await User.deleteOne({ _id: userId });
    res.status(200).json({
      message: "OK"
    });
  } catch (e) {
    next(e);
  }
};

export { getMany, update, remove };
