import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { getAll, createOne, updateOne, deleteOne } from "../controllers/posts";

const router = express.Router();

router.route("/").get(getAll).post(verifyToken, createOne);

router
  .route("/:postId")
  .put(verifyToken, updateOne)
  .delete(verifyToken, deleteOne);

export default router;
