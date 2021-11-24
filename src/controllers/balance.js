import { convertToVND } from 'utils/currency';

export const BalanceController = {
  charge: async (req, res, next) => {
    try {
      const { balance, currency } = req.body;
      const { userId } = req.params;
      const user = User.findOne({ _id: userId });
      if (req.user.role !== 'admin' && userId !== req.user.userId) {
        const err = new Error(errorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const convertedBalance = convertToVND(currency, balance);
      user.balance += convertedBalance;
      await user.update();
      return res.status(201).json({
        message: 'Nạp tiền vào ví thành công.'
      });
    } catch (error) {
      return next(error);
    }
  }
};
