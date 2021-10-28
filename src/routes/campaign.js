import express from "express";
import { verifyToken } from "middlewares/verifyToken";
import {
  getByQuery,
  getByAuthor,
  getById,
  createOne,
  updateOne,
  deleteOne,
  activeOne,
  endOne
} from "controllers/campaign";
import { getCommentByCampaignId } from "controllers/comment";
const router = express.Router();

router.get("/search", getByQuery);
router.get("/own/:userId", verifyToken, getByAuthor);
router.post("/", verifyToken, createOne);

router
  .route("/:campaignId")
  .get(getById)
  .put(verifyToken, updateOne)
  .delete(verifyToken, deleteOne);

router.get("/:campaignId/comments", getCommentByCampaignId);
router.put("/:campaignId/active", verifyToken, activeOne);
router.put("/:campaignId/end", verifyToken, endOne);

export default router;
