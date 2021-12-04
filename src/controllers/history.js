import { ChargeHistory } from 'models/ChargeHistory';
import { Donation } from 'models/Donation';
import { User } from 'models/User';

export const HistoryController = {
  getCharges: async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (req.user.role !== 'admin' && userId !== req.user.userId) {
        const err = new Error(errorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const charges = await ChargeHistory.findOne({ author: userId });
      if (!charges) {
        const err = new Error(errorMessage.NOT_FOUND);
        err.statusCode = 404;
        return next(err);
      }
      res.status(200).json({
        charges
      });
    } catch (error) {
      return next(error);
    }
  },
  getDonations: async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (req.user.role !== 'admin' && userId !== req.user.userId) {
        const err = new Error(errorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const donations = await Donation.findOne({ author: userId });
      if (!donations) {
        const err = new Error(errorMessage.NOT_FOUND);
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
