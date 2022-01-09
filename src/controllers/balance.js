import { Transaction } from 'models/Transaction';
import { User } from 'models/User';
import { convertToVND } from 'utils/currency';

export const BalanceController = {
  charge: async (req, res, next) => {
    try {
      const { amount, currency, method, orderId } = req.body;
      const { userId } = req.params;
      const user = await User.findOne({ _id: userId });
      if (req.user.role !== 'admin' && userId !== req.user.userId) {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const convertedBalance = convertToVND(currency, amount);
      user.balance += convertedBalance / 100;
      const updatedUser = await user.save();
      if (updatedUser) {
        await Transaction.create({
          author: userId,
          amount,
          orderId,
          method,
          action: 'charge'
        });
      }
      return res.status(201).json({
        message: 'Nạp tiền vào ví thành công.'
      });
    } catch (error) {
      return next(error);
    }
  }
};
