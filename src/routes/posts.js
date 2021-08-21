import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  getAll,
  createOne,
  updateOne,
  deleteOne,
  likePost,
  commentPost
} from "../controllers/posts";

const router = express.Router();

router.route("/").get(getAll).post(verifyToken, createOne);

router
  .route("/:postId")
  .put(verifyToken, updateOne)
  .delete(verifyToken, deleteOne);

router.route("/:postId/like").patch(verifyToken, likePost);
router.post("/:postId/comment", commentPost);

export default router;
