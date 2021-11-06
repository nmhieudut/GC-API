import { Campaign } from "models/Campaign";
import { errorMessage } from "constants/error";
import mongoose from "mongoose";

async function getById(req, res, next) {
  const { campaignId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(200).json({
        campaign: {}
      });
    }
    const campaign = await Campaign.findOne({ _id: campaignId }).populate(
      "author",
      "name picture phoneNumber"
    );
    if (campaign) {
      return res.status(200).json({
        campaign
      });
    }
    return res.status(200).json({
      campaign: {}
    });
  } catch (e) {
    next(e);
  }
}

async function getByQuery(req, res, next) {
  const { q, skip } = req.query;
  const status = req.query.status ? req.query.status : "all";
  const name = new RegExp(q, "i");
  console.log("lllll", q, status);
  try {
    let campaigns;
    if (status === "all") {
      campaigns = await Campaign.find({ name })
        .sort("-createdAt")
        .populate("author", "name picture")
        .skip(Number.parseInt(skip))
        .limit(5);
    } else {
      campaigns = await Campaign.find({ $and: [{ status }, { name }] })
        .sort("-createdAt")
        .populate("author", "name picture")
        .skip(Number.parseInt(skip))
        .limit(5);
    }
    console.log("===found", campaigns);
    res.status(200).json({
      total: campaigns.length,
      campaigns
    });
  } catch (e) {
    next(e);
  }
}

async function getByAuthor(req, res, next) {
  const { userId } = req.user;

  try {
    const campaigns = await Campaign.find({ author: userId }).sort(
      "-createdAt"
    );
    res.json({ data: campaigns });
  } catch (e) {
    next(e);
  }
}

async function createOne(req, res, next) {
  try {
    const { userId } = req.user;
    const campaign = await Campaign.create({ ...req.body, author: userId });
    const newCampaign = await Campaign.findOne({ _id: campaign.id }).populate(
      "author",
      "name picture"
    );
    console.log("new post", newCampaign);
    res.status(200).json({
      newCampaign
    });
  } catch (e) {
    next(e);
  }
}

async function updateOne(req, res, next) {
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
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId,
        { ...req.body },
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
}

async function deleteOne(req, res, next) {
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
        message: "Hoạt động đã bị xóa"
      });
    }
    const err = new Error(errorMessage.FORBIDDEN);
    err.statusCode = 403;
    return next(err);
  } catch (e) {
    next(e);
  }
}
async function activeOne(req, res, next) {
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
      { status: "active" },
      { new: true, runValidator: true }
    );
    res.status(200).json({
      message: "Đã phê duyệt hoạt động này"
    });
  } catch (e) {
    next(e);
  }
}
async function endOne(req, res, next) {
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
      { status: "ended" },
      { new: true, runValidator: true }
    );
    res.status(200).json({
      message: "Kết thúc hoạt động thành công"
    });
  } catch (e) {
    next(e);
  }
}
export {
  getByQuery,
  getByAuthor,
  getById,
  createOne,
  updateOne,
  deleteOne,
  activeOne,
  endOne
};
