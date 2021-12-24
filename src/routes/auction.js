import { AuctionController } from 'controllers/auction';
import express from 'express';
import { auth } from 'middlewares/auth.middleware';

const router = express.Router();

router.get('/', AuctionController.getAll);
router.post('/', auth, AuctionController.createOne);
router.get('/:auctionId', AuctionController.getById);
router.put('/:auctionId', auth, AuctionController.updateOne);
router.put('/:auctionId/bid', auth, AuctionController.bidOne);
router.delete('/:auctionId', auth, AuctionController.deleteOne);

export default router;
