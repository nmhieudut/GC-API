import {
  createPaymentUrlVNPay,
  createVNPayIpn,
  payWithMomo,
  payWithStripe,
  returnVNPayUrl
} from 'controllers/checkout';
import express from 'express';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

router.post('/stripe', auth, payWithStripe);

router.post('/momo', auth, payWithMomo);

router.post('/vnpay', auth, createPaymentUrlVNPay);
// router.post('/charge/vn-pay/ipn', auth, createVNPayIpn);
// router.post('/charge/vn-pay/return', auth, returnVNPayUrl);
export default router;
