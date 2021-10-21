// import express from "express";
// import { verifyToken } from "../middlewares/verifyToken";
// import {
//   searchCampaigns,
//   getAll,
//   createOne,
//   updateOne,
//   deleteOne,
//   // likeCampaign,
//   commentCampaign
// } from "../controllers/campaign";

// const router = express.Router();

// router.get("/search", searchCampaigns);

// router.route("/").get(getAll).post(verifyToken, createOne);

// router
//   .route("/:campaignId")
//   .put(verifyToken, updateOne)
//   .delete(verifyToken, deleteOne);

// // router.route("/:campaignId/like").put(verifyToken, likeCampaign);
// router.post("/:campaignId/comment", verifyToken, commentCampaign);

// export default router;
