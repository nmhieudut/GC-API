import { responseErrorMessage } from 'constants/error';
import { Comment } from 'models/Comment';

async function getCommentByCampaignId(req, res, next) {
  const { campaignId } = req.params;
  try {
    const commentList = await Comment.find({ campaignId })
      .populate('author', 'name picture')
      .sort({ createdAt: -1 });
    // .skip(Number.parseInt(skip))
    // .limit(3);
    res.status(200).json(commentList);
  } catch (error) {
    next(error);
  }
}

async function createOne(req, res, next) {
  try {
    const { userId } = req.user;
    const { campaignId } = req.params;
    const comment = await Comment.create({
      ...req.body,
      author: userId,
      campaignId
    });
    console.log('new comment', comment);
    res.status(200).json({
      data: comment
    });
  } catch (e) {
    next(e);
  }
}
async function updateOne(req, res, next) {
  try {
    const { userId } = req.user;
    const { commentId } = req.params;
    const comment = await Comment.findOne({ _id: commentId });
    console.log('=======', userId, commentId);
    if (userId !== String(comment.author)) {
      const err = new Error(responseErrorMessage.FORBIDDEN);
      err.statusCode = 403;
      return next(err);
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { ...req.body },
      { new: true, runValidator: true }
    );
    console.log('new comment', comment);
    res.status(200).json({
      updatedComment
    });
  } catch (e) {
    next(e);
  }
}
async function deleteOne(req, res, next) {
  try {
    const { userId } = req.user;
    const { commentId } = req.params;
    const comment = await Comment.findOne({ _id: commentId });
    if (userId !== String(comment.author)) {
      const err = new Error(responseErrorMessage.FORBIDDEN);
      err.statusCode = 403;
      return next(err);
    }
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({
      message: 'OK'
    });
  } catch (e) {
    next(e);
  }
}
export { getCommentByCampaignId, createOne, updateOne, deleteOne };
