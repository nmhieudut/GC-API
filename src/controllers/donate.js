import { Campaign } from 'models/Campaign';
import { Donation } from 'models/Donation';
import { User } from 'models/User';
import { errorMessage } from 'constants/error';

export const DonateController = {
  donate: async (req, res, next) => {
    try {
      const { campaignId } = req.params;
      const { amount } = req.body;
      const donatingUser = await User.findOne({ _id: req.user.userId });
      if (donatingUser.balance - amount < 0) {
        const error = new Error(errorMessage.INSUFFICIENT_BALANCE);
        error.statusCode = 400;
        return next(error);
      }
      donatingUser.balance -= amount;
      await donatingUser.save();
      const donatedCampaign = await Campaign.findOne({ _id: campaignId });
      donatedCampaign.donated_amount += amount;
      await donatedCampaign.save();
      await Donation.create({
        ...req.body,
        campaignId,
        donator: req.user.userId
      });
      return res.status(200).json({
        status: 'ok',
        message: 'Đã đóng góp thành công'
      });
    } catch (error) {
      return next(error);
    }
  },
  refund: async (req, res, next) => {
    try {
    } catch (error) {
      return next(error);
    }
  },
  getDonators: async (req, res, next) => {
    try {
      const { campaignId } = req.params;
      const donators = await Donation.find({ campaignId }).populate(
        'donator',
        'name picture phoneNumber'
      );
      return res.status(200).json({
        status: 'ok',
        donators
      });
    } catch (error) {
      return next(error);
    }
  }
};
