import { userController } from 'controllers/user';
import express from 'express';
import { adminGuard, auth } from 'middlewares';

const router = express.Router();

// swagger docs
/**
 * @swagger
 * /users:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.get('/', userController.getMany);
router.put('/:userId/reset-password', auth, userController.resetPassword);
router.get('/:userId/donations', auth, userController.getOwnDonations);
router.get('/:userId/transactions', auth, userController.getOwnTransactions);
export default router;
