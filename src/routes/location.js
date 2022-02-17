import { LocationController } from 'controllers/location';
import express from 'express';

const router = express.Router();

router.get('/', LocationController.getAll);
router.get('/district/:provinceId', LocationController.getDistrictsById);
router.get('/ward/:provinceId', LocationController.getWardsById);

export default router;
