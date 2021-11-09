import { userController } from "controllers/user";
import express from "express";
import { verifyToken } from "middlewares/verifyToken";

const router = express.Router();
router.get("/", userController.getMany);

router
  .route("/")
  .put(verifyToken, userController.update)
  .delete(verifyToken, userController.remove);

export default router;
