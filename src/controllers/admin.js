import { Campaign } from 'models/Campaign';
import { Donation } from 'models/Donation';
import { User } from 'models/User';
import bcrypt from 'bcrypt';

export const AdminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find({ role: { $ne: 'admin' } }).select(
        '-password'
      );
      res.json({ users });
    } catch (e) {
      next(e);
    }
  },
  getUserById: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).select('-password');
      res.json({ user });
    } catch (e) {
      next(e);
    }
  },
  createUser: async (req, res, next) => {
    try {
      const { email } = req.body;
      const existedUser = await User.findOne({ email: email });
      if (existedUser) {
        const err = new Error(requestErrorMessage.EXISTED_EMAIL);
        err.statusCode = 400;
        return next(err);
      }
      const newUser = new User(req.body);
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      const user = await newUser.save();
      res.status(200).json({
        message: 'Thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  updateUserById: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const { password } = req.body;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      await User.findByIdAndUpdate(
        userId,
        { ...req.body, balance: parseFloat(req.body.balance) },
        {
          new: true,
          runValidator: true
        }
      );
      res.status(200).json({
        message: 'Cập nhật thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  toggleUserStatus: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      user.isActive = !user.isActive;
      await user.save();
      res.status(200).json({
        message: user.active
          ? 'Kích hoạt thành công'
          : 'Khóa tài khoản thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  deleteUserById: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      await user.remove();
      res.status(200).json({
        message: 'Xóa tài khoản thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  getCampaigns: async (req, res, next) => {
    try {
      const campaigns = await Campaign.find({}).populate(
        'author',
        'name picture'
      );
      res.json({ campaigns });
    } catch (e) {
      next(e);
    }
  },
  getCampaignById: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const campaign = await Campaign.findById(campaignId);
      res.json({ campaign });
    } catch (e) {
      next(e);
    }
  },
  updateCampaignById: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        ...req.body,
        { new: true }
      );
      res.json({ campaign });
    } catch (e) {
      next(e);
    }
  },
  deleteCampaignById: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const campaign = await Campaign.findById(campaignId);
      await campaign.remove();
      res.status(200).json({
        message: 'Xóa chiến dịch thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  activeOne: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      await Campaign.findByIdAndUpdate(
        campaignId,
        { status: 'active' },
        { new: true, runValidator: true }
      );
      res.status(200).json({
        message: 'Kích hoạt chiến dịch thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  endOne: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      await Campaign.findByIdAndUpdate(
        campaignId,
        { status: 'ended' },
        { new: true, runValidator: true }
      );
      res.status(200).json({
        message: 'Kết thúc chiến dịch thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  getDonations: async (req, res, next) => {
    const donations = await Donation.find({});
    res.json({ donations });
  },
  getDonationsByUserId: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const donations = await Donation.find({ donator: userId });
      res.json({ donations });
    } catch (e) {
      next(e);
    }
  },
  getDonationsByCampaignId: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const donations = await Donation.find({ campaignId });
      res.json({ donations });
    } catch (e) {
      next(e);
    }
  },
  getTransactions: async (req, res, next) => {
    const transactions = await Transaction.find({}).populate(
      'donator',
      'name picture'
    );
    res.json({ transactions });
  },
  getTransactionsByUserId: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const transactions = await Transaction.find({ author: userId }).populate(
        'donator',
        'name picture'
      );
      res.json({ transactions });
    } catch (e) {
      next(e);
    }
  },
  deleteTransactionById: async (req, res, next) => {
    const { transactionId } = req.params;
    try {
      const transaction = await Transaction.findById(transactionId);
      await transaction.remove();
      res.status(200).json({
        message: 'Xóa giao dịch thành công'
      });
    } catch (e) {
      next(e);
    }
  }
};
