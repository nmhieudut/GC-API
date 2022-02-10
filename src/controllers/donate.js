import { Campaign } from 'models/Campaign';
import { Donation } from 'models/Donation';
import { User } from 'models/User';
import { responseErrorMessage } from 'constants/error';
import { Transaction } from 'models/Transaction';

export const DonateController = {
  donate: async (req, res, next) => {
    try {
      const { campaignId } = req.params;
      const { amount } = req.body;
      const donatingUser = await User.findOne({ _id: req.user.userId });
      const donatedCampaign = await Campaign.findOne({ _id: campaignId });
      if (donatedCampaign.status !== 'active') {
        const error = new Error(responseErrorMessage.INVALID_CAMPAIGN);
        error.statusCode = 400;
        return next(error);
      }
      if (donatingUser.balance - amount < 0) {
        const error = new Error(responseErrorMessage.INSUFFICIENT_BALANCE);
        error.statusCode = 400;
        return next(error);
      }
      donatingUser.balance -= amount;
      await donatingUser.save();
      donatedCampaign.donated_amount += amount;
      await donatedCampaign.save();
      await Donation.create({
        ...req.body,
        campaignId,
        donator: req.user.userId,
        action: 'thu',
        lastBalance: donatedCampaign.donated_amount
      });
      await Transaction.create({
        author: req.user.userId,
        amount,
        action: 'Quyên góp'
      });
      return res.status(200).json({
        status: 'ok',
        message: 'Đã đóng góp thành công'
      });
    } catch (error) {
      return next(error);
    }
  },
  getDonatorsByCampaignId: async (req, res, next) => {
    try {
      const { campaignId } = req.params;
      const donators = await Donation.find({ campaignId }).populate(
        'donator',
        'name picture phoneNumber'
      );
      return res.status(200).json({
        donators
      });
    } catch (error) {
      return next(error);
    }
  }
};
