import express from 'express';
import { auth } from 'middlewares/auth.middleware';
import { createOne } from 'controllers/comment';

const router = express.Router();

router.post('/:campaignId', auth, createOne);

export default router;
