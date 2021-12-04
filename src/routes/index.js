import express from 'express';
import authRoute from './auth';
import userRoute from './user';
import campaignRoute from './campaign';
import commentRoute from './comment';
import checkoutRoute from './checkout';
import balanceRoute from './balance';
import historyRoute from './history';

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
    path: '/history',
    route: historyRoute
  }
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
