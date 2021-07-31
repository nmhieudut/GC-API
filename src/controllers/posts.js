const Post = require("../models/Post");

exports.getAll = async function (req, res, next) {
  try {
    const posts = await Post.find({})
      .populate("author", "displayName")
      .select("content createdAt");
    res.status(200).json({
      status: "success",
      total: posts.length,
      data: { posts }
    });
  } catch (e) {
    next(e);
  }
};
exports.createOne = async function (req, res, next) {
  try {
    const { userId } = req.user;
    const post = await Post.create({ ...req.body, author: userId });
    res.status(200).json({
      status: "success",
      data: { post }
    });
  } catch (e) {
    next(e);
  }
};
exports.updateOne = async function (req, res, next) {
  try {
    const { postId } = req.params;
    const posts = await Post.findByIdAndUpdate(
      postId,
      { ...req.body },
      { new: true, runValidator: true }
    );
    res.status(200).json({
      status: "success",
      data: { posts }
    });
  } catch (e) {
    next(e);
  }
};
exports.deleteOne = async function (req, res, next) {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      status: "success",
      message: "Post has been deleted"
    });
  } catch (e) {
    next(e);
  }
};
