const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const PostController = require("../controllers/posts");

const router = express.Router();

router
  .route("/")
  .get(PostController.getAll)
  .post(verifyToken, PostController.createOne);

router
  .route("/:postId")
  .put(verifyToken, PostController.updateOne)
  .delete(verifyToken, PostController.deleteOne);

module.exports = router;
