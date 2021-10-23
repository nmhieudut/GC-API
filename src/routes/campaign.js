import express from "express";
import { verifyToken } from "middlewares/verifyToken";
import {
  getByQuery,
  getByAuthor,
  createOne
  // updateOne,
  // deleteOne,
  // likeCampaign,
  // commentCampaign
} from "controllers/campaign";

const router = express.Router();

router.get("/search", getByQuery);
router.get("/:userId", verifyToken, getByAuthor);
router.post("/", verifyToken, createOne);

router.route("/:campaignId");
// .put(verifyToken, updateOne)
// .delete(verifyToken, deleteOne);

// router.route("/:campaignId/like").put(verifyToken, likeCampaign);
// router.post("/:campaignId/comment", verifyToken, commentCampaign);

export default router;
