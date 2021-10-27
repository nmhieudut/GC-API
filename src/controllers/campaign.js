import { Campaign } from "models/Campaign";
import { errorMessage } from "constants/error";

async function getById(req, res, next) {
  const { campaignId } = req.params;
  try {
    const campaign = await Campaign.findOne({ _id: campaignId }).populate(
      "author",
      "name picture phoneNumber"
    );
    res.status(200).json({
      campaign
    });
  } catch (e) {
    next(e);
  }
}

async function getByQuery(req, res, next) {
  const { status, q } = req.query;
  const name = new RegExp(q, "i");
  try {
    const campaigns = await Campaign.find({ $or: [{ status }, { name }] })
      .sort("-createdAt")
      .populate("author", "name picture");
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
    const { userId } = req.user;
    const { campaignId } = req.params;
    const campaign = await Campaign.findOne({ _id: campaignId });
    if (userId !== String(campaign.author)) {
      const err = new Error(errorMessage.FORBIDDEN);
      err.statusCode = 403;
      return next(err);
    }
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { ...req.body },
      { new: true, runValidator: true }
    );

    res.status(200).json({
      updatedCampaign
    });
  } catch (e) {
    next(e);
  }
}

async function deleteOne(req, res, next) {
  try {
    const { userId } = req.user;
    const { campaignId } = req.params;
    const campaign = await Campaign.findOne({ _id: campaignId });
    if (userId !== String(campaign.author)) {
      const err = new Error(errorMessage.FORBIDDEN);
      err.statusCode = 403;
      return next(err);
    }
    await Campaign.findByIdAndDelete(campaignId);
    res.status(200).json({
      message: "Campaign has been deleted"
    });
  } catch (e) {
    next(e);
  }
}

async function endOne(req, res, next) {
  try {
    const { userId } = req.user;
    const { campaignId } = req.params;
    const campaign = await Campaign.findOne({ _id: campaignId });
    if (userId !== String(campaign.author)) {
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
      message: "Campaign has been ended"
    });
  } catch (e) {
    next(e);
  }
}

// async function commentPost(req, res, next) {
//   try {
//     const { userId } = req.user;
//     const { postId } = req.params;
//     const { content } = req.body;

//     const post = await Post.findById(postId);
//     const comment = await Comment.create({
//       text: content,
//       commentor: userId
//     });
//     post.comments.push(comment);
//     const commentedPost = await Post.findByIdAndUpdate(postId, post, {
//       new: true
//     })
//       .populate("author", "name picture")
//       .populate("likes", "name picture")
//       .populate({
//         path: "comments",
//         model: "Comment",
//         populate: {
//           path: "commentor",
//           model: "User",
//           select: "name picture"
//         }
//       });

//     res.status(200).json({
//       status: "success",
//       data: { post: commentedPost }
//     });
//   } catch (e) {
//     next(e);
//   }
// }
// // =======Will be implemented
// // async function editComment(req, res, next) {}
// // async function deleteComment(req, res, next) {}
// // async function getCommentsById(req,res,next) {}

export {
  getByQuery,
  getByAuthor,
  getById,
  createOne,
  updateOne,
  deleteOne,
  endOne
  // commentPost
};
