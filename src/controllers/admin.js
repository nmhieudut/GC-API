import { Campaign } from 'models/Campaign';
import { Donation } from 'models/Donation';
import { User } from 'models/User';
import bcrypt from 'bcrypt';
import { requestErrorMessage } from 'constants/error';
import { Transaction } from 'models/Transaction';
import { Auction } from 'models/Auction';

export const AdminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find({ role: { $ne: 'admin' } }).select(
        '-password'
      );
      return res.json({ users });
    } catch (e) {
      next(e);
    }
  },
  getUserById: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).select('-password');
      return res.json({ user });
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
      return res.status(200).json({
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
      return res.status(200).json({
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
      return res.status(200).json({
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
      return res.status(200).json({
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
        'name picture phoneNumber'
      );
      return res.json({ campaigns });
    } catch (e) {
      next(e);
    }
  },
  getCampaignById: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const campaign = await Campaign.findById(campaignId);
      return res.json({ campaign });
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
      return res.json({ campaign });
    } catch (e) {
      next(e);
    }
  },
  deleteCampaignById: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const campaign = await Campaign.findById(campaignId);
      await campaign.remove();
      return res.status(200).json({
        message: 'Xóa chiến dịch thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  renewalCampaign: async (req, res, next) => {
    const { campaignId } = req.params;
    const { addedDays } = req.body;
    try {
      const campaign = await Campaign.findById(campaignId);
      if (campaign.status === 'ended') {
        const endedAt = new Date(campaign.finishedAt);
        campaign.finishedAt = endedAt.setDate(
          endedAt.getDate() + parseInt(addedDays)
        );
        campaign.status = 'active';
        await campaign.save();
        return res.status(200).json({
          message: 'Gia hạn thành công'
        });
      } else {
        const err = new Error(requestErrorMessage.INVALID_CAMPAIGN_STATUS);
        err.statusCode = 400;
        return next(err);
      }
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
      return res.status(200).json({
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
        { status: 'ended', finishedAt: new Date() },
        { new: true, runValidator: true }
      );
      return res.status(200).json({
        message: 'Kết thúc chiến dịch thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  getREByCampaignId: async (req, res, next) => {
    const { campaignId } = req.params;
    const { month, year } = req.query;
    try {
      if (month === 'all' && year === 'all') {
        const donations = await Donation.find({ campaignId });
        return res.status(200).json({ donations });
      }
      const donations = await Donation.find({
        campaignId,
        createdAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-31`)
        }
      });
      return res.status(200).json({ donations });
    } catch (e) {
      return next(e);
    }
  },
  transferMoneyToCampaign: async (req, res, next) => {
    // const { campaignId } = req.params;
    // const { amount } = req.body;
    // try {
    //   const campaign = await Campaign.findById(campaignId);
    //   if (campaign.status === 'active') {
    //     campaign.balance += parseFloat(amount);
    //     await campaign.save();
    //     res.status(200).json({
    //       message: 'Nạp tiền thành công'
    //     });
    //   } else {
    //     const err = new Error(requestErrorMessage.INVALID_CAMPAIGN_STATUS);
    //     err.statusCode = 400;
    //     return next(err);
    //   }
    // } catch (e) {
    //   next(e);
    // }
  },
  getDonations: async (req, res, next) => {
    const donations = await Donation.find({}).populate(
      'donator',
      'name picture phoneNumber'
    );

    return res.json({ donations });
  },
  getDonationsByUserId: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const donations = await Donation.find({ donator: userId });
      return res.json({ donations });
    } catch (e) {
      next(e);
    }
  },
  getTransactions: async (req, res, next) => {
    const transactions = await Transaction.find({}).populate(
      'author',
      'name email picture'
    );
    res.json({ transactions });
  },
  getTransactionsByUserId: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const transactions = await Transaction.find({ author: userId }).populate(
        'author',
        'name email picture'
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
  },
  getDonationsByCampaignId: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const donations = await Donation.find({ campaignId }).populate(
        'donator',
        'name picture phoneNumber'
      );
      res.json({ donations });
    } catch (e) {
      next(e);
    }
  },
  getDonationsByAuthor: async (req, res, next) => {
    const { userId } = req.params;
    const { month, year } = req.query;
    try {
      // find donations in a specific month and year
      const donations = await Donation.find({
        donator: userId,
        createdAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(`${year}-${month}-31`)
        }
      })
        .populate('donator', 'name email picture')
        .sort('createdAt');

      res.status(200).json({ results: donations });
    } catch (e) {
      next(e);
    }
  },
  getAuctions: async (req, res, next) => {
    const auctions = await Auction.find({})
      .populate('author', 'name picture')
      .populate('campaign', 'name slug')
      .populate({
        path: 'currentBid',
        model: 'Bid',
        populate: { path: 'author', model: 'User', select: 'name picture' }
      })
      .populate({
        path: 'bids',
        model: 'Bid',
        populate: {
          path: 'author',
          model: 'User',
          select: 'name picture'
        }
      });
    res.json({ auctions });
  },
  createAuction: async (req, res, next) => {
    try {
      const newAuction = new Auction({
        ...req.body,
        author: req.user.userId
      });
      await newAuction.save();
      res.status(201).json({
        message: 'Phiên đấu giá được tạo thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  getAuctionById: async (req, res, next) => {
    const { auctionId } = req.params;
    try {
      const auction = await Auction.findById(auctionId).populate(
        'author',
        'name picture'
      );
      res.json({ auction });
    } catch (e) {
      next(e);
    }
  },
  updateAuctionById: async (req, res, next) => {
    const { auctionId } = req.params;
    try {
      const auction = await Auction.findByIdAndUpdate(
        auctionId,
        { ...req.body },
        { new: true }
      );
      res.json({ auction });
    } catch (e) {
      next(e);
    }
  },
  deleteAuctionById: async (req, res, next) => {
    const { auctionId } = req.params;
    try {
      const auction = await Auction.findById(auctionId);
      await auction.remove();
      res.status(200).json({
        message: 'Xóa phiên đấu giá thành công'
      });
    } catch (e) {
      next(e);
    }
  }
};
