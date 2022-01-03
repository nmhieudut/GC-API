import { User } from 'models/User';
import { requestErrorMessage, responseErrorMessage } from 'constants/error';
import bcrypt from 'bcrypt';
import { Donation } from 'models/Donation';
import { Campaign } from 'models/Campaign';
import { History } from 'models/History';

export const userController = {
  getMany: async (req, res, next) => {
    try {
    } catch (e) {
      next(e);
    }
  },
  update: async (req, res, next) => {
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
          dateOfBirth: user.dateOfBirth,
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
          message: 'Đổi mật khẩu thành công'
        });
      }
      const err = new Error('Mật khẩu cũ không đúng');
      err.statusCode = 400;
      return next(err);
    } catch (e) {
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      const { userId, isAdmin } = req.body;
      await User.deleteOne({ _id: userId });
      res.status(200).json({
        message: 'OK'
      });
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
      const histories = await History.find({ author: userId });
      return res.status(200).json({
        histories
      });
    } catch (error) {
      return next(error);
    }
  }
};
