import express from "express";
import { verifyToken } from "middlewares/verifyToken";
import { payWithStripe, payWithMomo } from "controllers/payment";

const router = express.Router();

router.post("/stripe/checkout", verifyToken, payWithStripe);

router.post("/momo/checkout", verifyToken, payWithMomo);

export default router;
