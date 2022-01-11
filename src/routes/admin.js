import { AdminController } from 'controllers/admin';
import express from 'express';
import { adminGuard } from 'middlewares';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /admin/users:
 *  get:
 *    description: Use to request all users
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *          required: true
 *    responses:
 *      '200':
 *        description: A successful response
 */

// user
router.get('/users', auth, adminGuard, AdminController.getUsers);
router.get('/users/:userId', auth, adminGuard, AdminController.getUserById);
router.post('/users', auth, adminGuard, AdminController.createUser);
router.put('/users/:userId', auth, adminGuard, AdminController.updateUserById);
router.put(
  '/users/:userId/active',
  auth,
  adminGuard,
  AdminController.toggleUserStatus
);
router.delete(
  '/users/:userId',
  auth,
  adminGuard,
  AdminController.deleteUserById
);

// campaign
router.get('/campaigns', auth, adminGuard, AdminController.getCampaigns);
router.get(
  '/campaigns/:campaignId',
  auth,
  adminGuard,
  AdminController.getCampaignById
);
router.put(
  '/campaigns/:campaignId',
  auth,
  adminGuard,
  AdminController.updateCampaignById
);
router.delete(
  '/campaigns/:campaignId',
  auth,
  adminGuard,
  AdminController.deleteCampaignById
);
// renewal campaign
router.put(
  '/campaigns/:campaignId/renewal',
  auth,
  adminGuard,
  AdminController.renewalCampaign
);
router.put(
  '/campaigns/:campaignId/active',
  auth,
  adminGuard,
  AdminController.activeOne
);
router.put(
  '/campaigns/:campaignId/end',
  auth,
  adminGuard,
  AdminController.endOne
);

// transaction
router.get('/transactions', auth, adminGuard, AdminController.getTransactions);
router.delete(
  '/transactions/:transactionId',
  auth,
  adminGuard,
  AdminController.deleteTransactionById
);

// donations
router.get('/donations', auth, adminGuard, AdminController.getDonations);
// router.delete(
//   '/donations/:donationId',
//   auth,
//   adminGuard,
//   AdminController.deleteDonationById
// );

// auction
// router.put(
//   '/auctions/:auctionId',
//   auth,
//   adminGuard,
//   AdminController.updateAuctionById
// );
// router.delete(
//   '/auctions/:auctionId',
//   auth,
//   adminGuard,
//   AdminController.deleteAuctionById
// );

export default router;
