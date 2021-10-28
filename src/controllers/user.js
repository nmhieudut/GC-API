import { BankAccount } from "models/BankAccount";
import { User } from "models/User";

const getMany = async (req, res, next) => {
  try {
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const { userId, isAdmin } = req.user;
    const {
      name,
      phoneNumber,
      address,
      accountNumber,
      accountName,
      bankAddress
    } = req.body;
    const foundUser = await User.findOne({ _id: userId });
    if (userId !== String(foundUser.author) || !isAdmin) {
      const err = new Error(errorMessage.FORBIDDEN);
      err.statusCode = 403;
      return next(err);
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { name, phoneNumber, address },
      { new: true, runValidator: true }
    );
    const existedBA = await BankAccount.findOne({ owner: userId });
    let bankAccount = null;
    if (existedBA) {
      bankAccount = await BankAccount.findByIdAndUpdate(
        existedBA._id,
        { accountNumber, accountName, bankAddress, amount },
        { new: true, runValidator: true }
      );
    } else {
      const newBA = new BankAccount({
        owner: userId,
        accountNumber,
        accountName,
        bankAddress,
        amount
      });
      bankAccount = await newBA.save();
    }

    console.log("bank", bankAccount);
    res.status(200).json({
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isAdmin: user.isAdmin,
        accountId: bankAccount._id,
        accountNumber: bankAccount.accountNumber,
        accountName: bankAccount.accountName,
        bankAddress: bankAccount.bankAddress
      }
    });
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
