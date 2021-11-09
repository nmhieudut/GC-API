import { WalletController } from "controllers/wallet";
import express from "express";
import { verifyToken } from "middlewares/verifyToken";

const router = express.Router();
router.get("/", verifyToken, () => {}); //get info
router.post("/", verifyToken, WalletController.createOne); //tao vi
router.put("/", verifyToken, WalletController.editOne); // nap tien vao vi
router.delete("/", verifyToken, () => {}); // xoa vi

export default router;
