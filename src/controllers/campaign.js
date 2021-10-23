import { Campaign } from "models/Campaign";
// import { Comment } from "models/Comment";
async function getByQuery(req, res, next) {
  const { status, q } = req.query;
  const name = new RegExp(q, "i");
  try {
    const campaigns = await Campaign.find({ $or: [{ status }, { name }] })
      .sort("-createdAt")
      .populate("author", "name picture");
    res.status(200).json({
      total: campaigns.length,
      data: { campaigns }
    });
  } catch (e) {
    next(e);
  }
}

async function getByAuthor(req, res, next) {
  const { userId } = req.user;

  try {
    const campaigns = await Campaign.find({ author: userId });

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
      data: newCampaign
    });
  } catch (e) {
    next(e);
  }
}

// async function updateOne(req, res, next) {
//   try {
//     const { postId } = req.params;
//     const post = await Post.findByIdAndUpdate(
//       postId,
//       { ...req.body },
//       { new: true, runValidator: true }
//     );
//     const newPost = await Post.findOne({ _id: post.id })
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
//       data: { post: newPost }
//     });
//   } catch (e) {
//     next(e);
//   }
// }

// async function deleteOne(req, res, next) {
//   try {
//     const { postId } = req.params;
//     await Post.findByIdAndDelete(postId);
//     res.status(200).json({
//       status: "success",
//       message: "Post has been deleted"
//     });
//   } catch (e) {
//     next(e);
//   }
// }

// async function likePost(req, res, next) {
//   try {
//     const { postId } = req.params;
//     const { userId } = req.user;
//     if (!userId) {
//       return res.status(403).json({
//         message: "Unauthenticated"
//       });
//     }
//     const post = await Post.findById(postId);
//     const index = post.likes.findIndex(likedUser =>
//       likedUser._id.equals(userId)
//     );

//     if (index === -1) {
//       post.likes.push(userId);
//     } else {
//       post.likes = post.likes.filter(
//         likedUser => !likedUser._id.equals(userId)
//       );
//     }
//     const updatedPost = await Post.findByIdAndUpdate(postId, post, {
//       new: true,
//       runValidator: true
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
//       data: { post: updatedPost }
//     });
//   } catch (e) {
//     next(e);
//   }
// }
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

// async function getPostsBySearch(req, res, next) {
//   try {
//     const { q } = req.query;
//     console.log("query", q);
//     const content = new RegExp(q, "i");
//     const posts = await Post.find({ content })
//       .sort("-createdAt")
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
//       })
//       .select("content createdAt likes comments");

//     res.status(200).json({ status: "success", data: posts });
//   } catch (e) {
//     next(e);
//   }
// }

export {
  getByQuery,
  getByAuthor,
  createOne
  // updateOne,
  // deleteOne,
  // likePost,
  // commentPost
};
