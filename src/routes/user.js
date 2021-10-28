import express from "express";
import { remove, update } from "controllers/user";
import { verifyToken } from "middlewares/verifyToken";
import { getMany } from "controllers/user";

const router = express.Router();
router.get("/", getMany);

router.route("/").put(verifyToken, update).delete(verifyToken, remove);

export default router;
