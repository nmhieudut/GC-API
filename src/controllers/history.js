import { History } from 'models/History';
import { Donation } from 'models/Donation';
import { User } from 'models/User';

export const HistoryController = {
  getTransactions: async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (req.user.role !== 'admin' && userId !== req.user.userId) {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const histories = await History.findOne({ author: userId });
      if (!histories) {
        const err = new Error(responseErrorMessage.NOT_FOUND);
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({
        histories
      });
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
