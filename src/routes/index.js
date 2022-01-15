import express from 'express';
import authRoute from './auth';
import userRoute from './user';
import campaignRoute from './campaign';
import commentRoute from './comment';
import checkoutRoute from './checkout';
import balanceRoute from './balance';
import newsRoute from './news';
import auctionRoute from './auction';
import provinceRoute from './province';
//admin
import adminRoute from './admin';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/campaigns',
    route: campaignRoute
  },
  {
    path: '/comments',
    route: commentRoute
  },
  {
    path: '/checkout',
    route: checkoutRoute
  },
  {
    path: '/balance',
    route: balanceRoute
  },
  {
    path: '/auctions',
    route: auctionRoute
  },
  {
    path: '/province',
    route: provinceRoute
  },
  {
    path: '/news',
    route: newsRoute
  },
  {
    path: '/admin',
    route: adminRoute
  }
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
