import { AdminController } from 'controllers/admin';
import express from 'express';
import { adminGuard } from 'middlewares';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

// admin user
router.get('/users', auth, adminGuard, AdminController.getUsers);
router.get('/users/:userId', auth, adminGuard, AdminController.getUserById);
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

// admin campaign
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

// // adminGuard auction
// router.get('/auction', auth, adminGuard, AdminController.getAuctions);
// router.get(
//   '/auctions/:auctionId',
//   auth,
//   adminGuard,
//   AdminController.getAuctionById
// );
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
// router.put(
//   '/auctions/:auctionId/active',
//   auth,
//   adminGuard,
//   AdminController.updateAuctionStatusById
// );

export default router;
