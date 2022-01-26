import express from 'express';
import { auth } from 'middlewares/auth.middleware';
import { createOne, deleteOne } from 'controllers/comment';

const router = express.Router();

router.post('/:campaignId', auth, createOne);
router.delete('/:commentId', auth, deleteOne);

export default router;
