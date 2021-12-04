import { HistoryController } from 'controllers/history';
import express from 'express';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

router.get('/donate', auth, HistoryController.getDonations);

router.get('/charge', auth, HistoryController.getCharges);
export default router;
