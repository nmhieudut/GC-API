import { userController } from 'controllers/user';
import express from 'express';
import { auth } from 'middlewares';

const router = express.Router();

router.get('/', userController.getMany);
router.put('/:userId/reset-password', auth, userController.resetPassword);
router.get('/:userId/donations', auth, userController.getOwnDonations);
router.get('/:userId/transactions', auth, userController.getOwnTransactions);
router.put('/:userId/update-profile', auth, userController.updateProfile);
export default router;
