import { WalletController } from 'controllers/wallet';
import express from 'express';
import { verifyToken } from 'middlewares/verifyToken';

const router = express.Router();
router.get('/list', verifyToken, WalletController.getAll); //get info
router.post('/', verifyToken, WalletController.createOne); //tao vi
router.put('/:walletId', verifyToken, WalletController.editOne); // nap tien vao vi
router.delete('/:walletId', verifyToken, WalletController.deleteOne); // xoa vi

export default router;
