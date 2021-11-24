import { BalanceController } from 'controllers/balance';
import express from 'express';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();
router.put('/charge/:userId', auth, BalanceController.charge); // nap tien vao vi

export default router;
