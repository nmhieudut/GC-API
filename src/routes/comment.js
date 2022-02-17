import express from 'express';
import { auth } from 'middlewares/auth.middleware';
import { commentController } from 'controllers/comment';

const router = express.Router();

router.post('/:campaignId', auth, commentController.createOne);
router.delete('/:commentId', auth, commentController.deleteOne);

export default router;
