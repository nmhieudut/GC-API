import express from "express";
import { verifyToken } from "middlewares/verifyToken";
import { createOne } from "controllers/comment";

const router = express.Router();

router.post("/:campaignId", verifyToken, createOne);

export default router;
