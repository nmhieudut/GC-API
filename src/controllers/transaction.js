import { Transaction } from 'models/Transaction';
import { Donation } from 'models/Donation';
import { User } from 'models/User';

export const TransactionController = {
  getByAuthorId: async (req, res, next) => {
    try {
      const { authorId } = req.params;
      const transactions = await Transaction.find({ author: authorId });
      res.status(200).json({ transactions });
    } catch (error) {
      return next(error);
    }
  },
  getDonations: async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (req.user.role !== 'admin' && userId !== req.user.userId) {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const donations = await Donation.findOne({ author: userId });
      if (!donations) {
        const err = new Error(responseErrorMessage.NOT_FOUND);
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({
        donations
      });
    } catch (error) {
      return next(error);
    }
  }
};
