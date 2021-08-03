import express from "express";
import { login, register } from "../controllers/auth";
import { checkCurrentUser } from "../middlewares/auth/currentUser";
import { getCurrentUser } from "../controllers/auth";
const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/").get(checkCurrentUser, getCurrentUser);

export default router;
