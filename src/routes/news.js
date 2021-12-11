import express from 'express';
import { getAll } from 'controllers/news';

const router = express.Router();

router.get('/', getAll);

export default router;
