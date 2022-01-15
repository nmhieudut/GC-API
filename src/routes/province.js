import { ProvinceController } from 'controllers/province';
import express from 'express';

const router = express.Router();

router.get('/', ProvinceController.getAll);
router.get('/district/:provinceId', ProvinceController.getDistrictsById);
router.get('/ward/:provinceId', ProvinceController.getWardsById);

export default router;
