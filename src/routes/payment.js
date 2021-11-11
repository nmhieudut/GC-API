import express from 'express';
import { verifyToken } from 'middlewares/verifyToken';
import { payWithStripe, payWithMomo } from 'controllers/payment';

const router = express.Router();

router.post('/stripe/charge', verifyToken, payWithStripe);

router.post('/momo/charge', verifyToken, payWithMomo);

export default router;
