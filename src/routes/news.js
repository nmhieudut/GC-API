import { newsController } from 'controllers/news';
import express from 'express';

const router = express.Router();

router.get('/', newsController.getAll);
router.get('/:id', newsController.getById);

export default router;
