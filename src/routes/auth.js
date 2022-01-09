import express from 'express';
import {
  getCurrentUser,
  login,
  register,
  googleLogin,
  logout
} from 'controllers/auth';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/google').post(googleLogin);
router.route('/verify').get(auth, getCurrentUser);
router.route('/logout').post(auth, logout);

export default router;
