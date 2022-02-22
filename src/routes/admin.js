import { AdminController } from 'controllers/admin';
import express from 'express';
import { adminGuard } from 'middlewares';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

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
router.get(
  '/campaigns/:campaignId/donations',
  auth,
  adminGuard,
  AdminController.getREByCampaignId
);

//donation
router.get(
  '/donations/:userId',
  auth,
  adminGuard,
  AdminController.getDonationsByAuthor
);
router.get('/donations', auth, adminGuard, AdminController.getDonations);

// transaction
router.get('/transactions', auth, adminGuard, AdminController.getTransactions);
router.delete(
  '/transactions/:transactionId',
  auth,
  adminGuard,
  AdminController.deleteTransactionById
);

// auction
router.get('/auctions', auth, adminGuard, AdminController.getAuctions);
router.get(
  '/auctions/:auctionId',
  auth,
  adminGuard,
  AdminController.getAuctionById
);
router.post('/auctions', auth, adminGuard, AdminController.createAuction);
router.put(
  '/auctions/:auctionId',
  auth,
  adminGuard,
  AdminController.updateAuctionById
);
router.delete(
  '/auctions/:auctionId',
  auth,
  adminGuard,
  AdminController.deleteAuctionById
);

export default router;
