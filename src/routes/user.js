import { userController } from 'controllers/user';
import express from 'express';
import { adminGuard, auth } from 'middlewares';

const router = express.Router();
router.get('/', userController.getMany);

router
  .route('/:userId')
  .put(auth, userController.update)
  .delete(auth, adminGuard, userController.remove);

router.put('/:userId/reset-password', auth, userController.resetPassword);
router.get('/:userId/donations', auth, userController.getOwnDonations);
router.get('/:userId/transactions', auth, userController.getOwnTransactions);
export default router;
