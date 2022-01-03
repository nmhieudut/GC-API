import express from 'express';
import { getCurrentUser, login, register, googleLogin } from 'controllers/auth';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/google').post(googleLogin);
router.route('/verify').get(auth, getCurrentUser);

export default router;
