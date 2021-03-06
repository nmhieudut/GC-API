import { responseErrorMessage } from 'constants/error';
import { Comment } from 'models/Comment';

export const commentController = {
  getByCampaignId: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const commentList = await Comment.find({ campaignId })
        .populate('author', 'name picture')
        .sort({ createdAt: -1 });
      res.status(200).json({ comments: commentList });
    } catch (error) {
      next(error);
    }
  },

  createOne: async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { campaignId } = req.params;
      const comment = await Comment.create({
        ...req.body,
        author: userId,
        campaignId
      });
      res.status(200).json({
        data: comment
      });
    } catch (e) {
      next(e);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { commentId } = req.params;
      const comment = await Comment.findOne({ _id: commentId });
      if (userId !== String(comment.author) && role !== 'admin') {
        const err = new Error(responseErrorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { ...req.body },
        { new: true, runValidator: true }
      );
      res.status(200).json({
        updatedComment
      });
    } catch (e) {
      next(e);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { commentId } = req.params;
      const comment = await Comment.findOne({ _id: commentId });
      if (userId !== String(comment.author) && role !== 'admin') {
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
};
