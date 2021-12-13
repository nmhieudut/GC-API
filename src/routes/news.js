import { newsController } from 'controllers/news';
import express from 'express';

const router = express.Router();

router.get('/', newsController.getAll);

export default router;
