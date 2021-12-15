import { responseErrorMessage } from 'constants/error';
import logger from 'middlewares/logger';
import { Campaign } from 'models/Campaign';
import { Donation } from 'models/Donation';
import mongoose from 'mongoose';
import slugify from 'slugify';

export const campaignController = {
  getSummary: async (req, res, next) => {
    try {
      const campaigns = await Campaign.find({});
      const donations = await Donation.find({});
      const totalDonations = donations.reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      console.log(campaigns.length, totalDonations, donations.length);
      res.status(200).json({
        total_campaigns: campaigns.length,
        total_amount_donations: totalDonations,
        total_donors: donations.length
      });
    } catch (error) {
      logger.info(error);
      next(error);
    }
  },

  getBySlug: async (req, res, next) => {
    const { slug } = req.params;
    try {
      const campaign = await Campaign.findOne({ slug }).populate(
        'author',
        'name picture phoneNumber'
      );
      if (campaign) {
        return res.status(200).json({
          campaign
        });
      }
      return res.status(404).json({
        message: 'Không tìm thấy hoạt động này'
      });
    } catch (e) {
      next(e);
    }
  },

  getByStatus: async (req, res, next) => {
    const status = req.params.status ? req.params.status : 'all';
    try {
      let campaigns;
      if (status === 'all') {
        campaigns = await Campaign.find({})
          .sort('-createdAt')
          .populate('author', 'name picture')
          .limit(6);
      } else {
        campaigns = await Campaign.find({ status })
          .sort('-createdAt')
          .populate('author', 'name picture')
          .limit(6);
      }
      res.status(200).json({
        campaigns
      });
    } catch (e) {
      next(e);
    }
  },

  getByQuery: async (req, res, next) => {
    const { q, limit, page } = req.query;
    const perPage = limit ? parseInt(limit) : 5;
    const status = req.query.status ? req.query.status : 'all';
    const name = new RegExp(q, 'i');
    try {
      let campaigns;
      if (status === 'all') {
        campaigns = await Campaign.find({ name })
          .sort('-createdAt')
          .populate('author', 'name picture')
          .skip(Number.parseInt(perPage) * (Number.parseInt(page) - 1))
          .limit(5);
      } else {
        campaigns = await Campaign.find({ $and: [{ status }, { name }] })
          .sort('-createdAt')
          .populate('author', 'name picture')
          .skip(Number.parseInt(perPage) * (Number.parseInt(page) - 1))
          .limit(5);
      }
      res.status(200).json({
        campaigns
      });
    } catch (e) {
      next(e);
    }
  },

  getByAuthor: async (req, res, next) => {
    const { userId } = req.params;

    try {
      const campaigns = await Campaign.find({ author: userId }).sort(
        '-createdAt'
      );
      res.json({ campaigns });
    } catch (e) {
      next(e);
    }
  },
  createOne: async (req, res, next) => {
    try {
      const { userId } = req.user;
      const slug = slugify(req.body.name, {
        replacement: '-',
        lower: true,
        locale: 'vi',
        trim: true
      });
      await Campaign.create({
        ...req.body,
        slug,
        author: userId
      });
      res.status(200).json({
        message: 'Tạo hoạt động thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { campaignId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(campaignId)) {
        return res.status(200).json({
          campaign: {}
        });
      }
      const campaign = await Campaign.findOne({ _id: campaignId });
      if (role !== 'admin' && String(campaign.author) !== userId) {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const slug = slugify(req.body.name, {
        replacement: '-',
        lower: true,
        locale: 'vi',
        trim: true
      });
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId,
        { ...req.body, slug },
        { new: true, runValidator: true }
      );
      return res.status(200).json({
        data: updatedCampaign
      });
    } catch (e) {
      next(e);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { campaignId } = req.params;
      const campaign = await Campaign.findOne({ _id: campaignId });
      if (role !== 'admin' && String(campaign.author) !== userId) {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      await Campaign.findByIdAndDelete(campaignId);
      return res.status(200).json({
        message: 'Hoạt động đã bị xóa'
      });
    } catch (e) {
      next(e);
    }
  },

  getDonations: async (req, res, next) => {
    try {
      const { campaignId } = req.params;
      const donations = await Donation.find({ campaignId }).populate(
        'donator',
        'name picture phoneNumber'
      );
      return res.status(200).json({
        donations
      });
    } catch (e) {
      next(e);
    }
  },

  activeOne: async (req, res, next) => {
    try {
      const { role } = req.user;
      const { campaignId } = req.params;
      if (role !== 'admin') {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      await Campaign.findByIdAndUpdate(
        campaignId,
        { status: 'active' },
        { new: true, runValidator: true }
      );
      res.status(200).json({
        message: 'Đã phê duyệt hoạt động này'
      });
    } catch (e) {
      next(e);
    }
  },
  endOne: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { campaignId } = req.params;
      const campaign = await Campaign.findOne({ _id: campaignId });
      if (role !== 'admin' && String(campaign.author) !== userId) {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      await Campaign.findByIdAndUpdate(
        campaignId,
        { status: 'ended' },
        { new: true, runValidator: true }
      );
      res.status(200).json({
        message: 'Kết thúc hoạt động thành công'
      });
    } catch (e) {
      next(e);
    }
  }
};
