import express from "express";
import { update } from "../controllers/user";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.route("/").put(verifyToken, update);

export default router;
