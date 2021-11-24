import { userController } from 'controllers/user';
import express from 'express';
import { adminGuard, auth } from 'middlewares';

const router = express.Router();
router.get('/', userController.getMany);

router
  .route('/:userId')
  .put(auth, userController.update)
  .delete(auth, adminGuard, userController.remove);

export default router;
