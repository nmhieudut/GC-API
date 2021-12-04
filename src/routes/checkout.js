import {
  createPaymentUrlVNPay,
  payWithMoMo,
  payWithStripe,
  returnVNPayUrl
} from 'controllers/checkout';
import express from 'express';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

router.post('/stripe', auth, payWithStripe);

router.post('/momo', auth, payWithMoMo);

router.post('/vn-pay', auth, createPaymentUrlVNPay);
router.get('/vn-pay/return', auth, returnVNPayUrl);
export default router;
