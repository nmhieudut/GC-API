import { CheckoutService } from 'controllers/checkout';
import express from 'express';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

router.post('/momo', auth, CheckoutService.createPaymentUrlMoMo);
router.get('/momo/return', auth, CheckoutService.returnMoMoUrl);
router.post('/vn-pay', auth, CheckoutService.createPaymentUrlVNPay);
router.get('/vn-pay/return', auth, CheckoutService.returnVNPayUrl);
export default router;
