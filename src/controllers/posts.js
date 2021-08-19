import { Post } from "../models/Post";

async function getAll(req, res, next) {
  try {
    const posts = await Post.find({})
      .sort("-createdAt")
      .populate({ path: "author", select: "displayName avatar" })
      .select("content createdAt");
    res.status(200).json({
      status: "success",
      total: posts.length,
      data: { posts }
    });
  } catch (e) {
    next(e);
  }
}

async function createOne(req, res, next) {
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
}

async function updateOne(req, res, next) {
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
}

async function deleteOne(req, res, next) {
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
}

export { getAll, createOne, updateOne, deleteOne };
