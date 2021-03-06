import { User } from 'models/User';
import { requestErrorMessage, responseErrorMessage } from 'constants/error';
import bcrypt from 'bcrypt';
import { Donation } from 'models/Donation';
import { Campaign } from 'models/Campaign';
import { Transaction } from 'models/Transaction';

export const userController = {
  getMany: async (req, res, next) => {
    try {
    } catch (e) {
      next(e);
    }
  },
  updateProfile: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { userId: updatedUserId } = req.params;
      if (role !== 'admin' && updatedUserId !== userId) {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }

      const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidator: true
      });
      return res.status(200).json({
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role
        }
      });
    } catch (e) {
      next(e);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { userId: updatedUserId } = req.params;
      const { currentPassword, newPassword } = req.body;
      if (userId !== updatedUserId && role !== 'admin') {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const user = await User.findById(userId);
      // compare old and new password
      const isMatch = bcrypt.compareSync(currentPassword, user.password);
      if (isMatch) {
        // check newPassword duplicated with old password
        const isDuplicated = currentPassword === newPassword;
        if (isDuplicated) {
          const err = new Error(requestErrorMessage.DUPLICATED_PASSWORD);
          err.statusCode = 409;
          return next(err);
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        return res.status(200).json({
          message: '?????i m???t kh???u th??nh c??ng'
        });
      }
      const err = new Error('M???t kh???u c?? kh??ng ????ng');
      err.statusCode = 400;
      return next(err);
    } catch (e) {
      next(e);
    }
  },
  getOwnDonations: async (req, res, next) => {
    console.log('Getting own donations');
    try {
      const { userId, role } = req.user;
      const { userId: updatedUserId } = req.params;
      if (userId !== updatedUserId && role !== 'admin') {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const donations = await Donation.find({ donator: userId });
      console.log('donations', donations);
      const donationsWithCampaign = await Promise.all(
        donations.map(async donation => {
          let campaignInfo = await Campaign.findOne({
            _id: donation.campaignId
          });
          return {
            ...donation._doc,
            campaignInfo
          };
        })
      );
      return res.status(200).json({
        status: 'ok',
        donations: donationsWithCampaign
      });
    } catch (error) {
      return next(error);
    }
  },
  getOwnTransactions: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { userId: updatedUserId } = req.params;
      if (userId !== updatedUserId && role !== 'admin') {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const histories = await Transaction.find({ author: userId });
      return res.status(200).json({
        histories
      });
    } catch (error) {
      return next(error);
    }
  }
};
