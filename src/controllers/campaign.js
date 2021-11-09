import { Campaign } from 'models/Campaign';
import { errorMessage } from 'constants/error';
import mongoose from 'mongoose';
import slugify from 'slugify';

export const campaignController = {
  getBySlug: async (req, res, next) => {
    const { slug } = req.params;
    console.log('getting by id');
    try {
      const campaign = await Campaign.findOne({ slug }).populate(
        'author',
        'name picture phoneNumber'
      );
      console.log('campaign by id', campaign);
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
  getByQuery: async (req, res, next) => {
    const { q, skip } = req.query;
    const status = req.query.status ? req.query.status : 'all';
    const name = new RegExp(q, 'i');
    try {
      let campaigns;
      if (status === 'all') {
        campaigns = await Campaign.find({ name })
          .sort('-createdAt')
          .populate('author', 'name picture')
          .skip(Number.parseInt(skip))
          .limit(5);
      } else {
        campaigns = await Campaign.find({ $and: [{ status }, { name }] })
          .sort('-createdAt')
          .populate('author', 'name picture')
          .skip(Number.parseInt(skip))
          .limit(5);
      }
      console.log('by query', campaigns);
      res.status(200).json({
        total: campaigns.length,
        campaigns
      });
    } catch (e) {
      next(e);
    }
  },
  getByAuthor: async (req, res, next) => {
    const { userId } = req.user;

    try {
      const campaigns = await Campaign.find({ author: userId }).sort(
        '-createdAt'
      );
      res.json({ data: campaigns });
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
        locale: 'en',
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
      const { userId, isAdmin } = req.user;
      const { campaignId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(campaignId)) {
        return res.status(200).json({
          campaign: {}
        });
      }
      const campaign = await Campaign.findOne({ _id: campaignId });
      if (
        userId === String(campaign.author) ||
        (userId !== String(campaign.author) && isAdmin === true)
      ) {
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
          updatedCampaign
        });
      }
      const err = new Error(errorMessage.FORBIDDEN);
      err.statusCode = 403;
      return next(err);
    } catch (e) {
      next(e);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { userId, isAdmin } = req.user;
      const { campaignId } = req.params;
      const campaign = await Campaign.findOne({ _id: campaignId });
      if (
        userId === String(campaign.author) ||
        (userId !== String(campaign.author) && isAdmin === true)
      ) {
        await Campaign.findByIdAndDelete(campaignId);
        return res.status(200).json({
          message: 'Hoạt động đã bị xóa'
        });
      }
      const err = new Error(errorMessage.FORBIDDEN);
      err.statusCode = 403;
      return next(err);
    } catch (e) {
      next(e);
    }
  },
  activeOne: async (req, res, next) => {
    try {
      const { isAdmin } = req.user;
      const { campaignId } = req.params;
      if (isAdmin === false) {
        const err = new Error(errorMessage.FORBIDDEN);
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
      const { userId, isAdmin } = req.user;
      const { campaignId } = req.params;
      const campaign = await Campaign.findOne({ _id: campaignId });
      if (
        userId === String(campaign.author) ||
        (userId !== String(campaign.author) && isAdmin === true)
      ) {
        const err = new Error(errorMessage.FORBIDDEN);
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
