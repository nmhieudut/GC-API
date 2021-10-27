import { Comment } from "models/Comment";

async function getCommentByCampaignId(req, res, next) {
  const { campaignId } = req.params;
  try {
    const commentList = await Comment.find({ campaignId })
      .populate("author", "name picture")
      .sort({ createdAt: -1 })
      // .skip(Number.parseInt(skip))
      .limit(3);
    res.status(200).json(commentList);
  } catch (error) {
    next(error);
  }
}

async function createOne(req, res, next) {
  try {
    const { userId } = req.user;
    const { campaignId } = req.params;
    console.log("=======", userId, campaignId);
    const comment = await Comment.create({
      ...req.body,
      author: userId,
      campaignId
    });
    console.log("new comment", comment);
    res.status(200).json({
      data: comment
    });
  } catch (e) {
    next(e);
  }
}
export { getCommentByCampaignId, createOne };
