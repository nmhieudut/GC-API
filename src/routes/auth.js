import express from "express";
import { getCurrentUser, login, register } from "../controllers/auth";
import { checkCurrentUser } from "../middlewares/currentUser";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/check-user").get(checkCurrentUser, getCurrentUser);

export default router;
