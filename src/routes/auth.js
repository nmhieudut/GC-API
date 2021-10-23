import express from "express";
import {
  verifyUser,
  login,
  register,
  googleLogin,
  facebookLogin
} from "controllers/auth";
import { checkCurrentUser } from "middlewares/currentUser";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/google").post(googleLogin);
router.route("/facebook").post(facebookLogin);
router.route("/verify").get(checkCurrentUser, verifyUser);

export default router;
