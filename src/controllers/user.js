import { User } from 'models/User';
import { errorMessage } from 'constants/error';
import bcrypt from 'bcrypt';
import { Donation } from 'models/Donation';
import { Campaign } from 'models/Campaign';
import { ChargeHistory } from 'models/ChargeHistory';

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
        const err = new Error(errorMessage.FORBIDDEN);
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
        const err = new Error(errorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const user = await User.findById(userId);
      // compare old and new password
      const isMatch = bcrypt.compareSync(currentPassword, user.password);
      if (isMatch) {
        user.password = newPassword;
        await user.save();
        return res.status(200).json({
          message: 'Đổi mật khẩu thành công'
        });
      }
      return res.status(400).json({
        message: 'Mật khẩu cũ không đúng'
      });
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
        const err = new Error(errorMessage.FORBIDDEN);
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
  getOwnCharges: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { userId: updatedUserId } = req.params;
      if (userId !== updatedUserId && role !== 'admin') {
        const err = new Error(errorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const charges = await ChargeHistory.find({ donator: userId });
      return res.status(200).json({
        status: 'ok',
        charges
      });
    } catch (error) {
      return next(error);
    }
  }
};
