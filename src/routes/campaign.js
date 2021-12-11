import { campaignController } from 'controllers/campaign';
import { getCommentByCampaignId } from 'controllers/comment';
import { DonateController } from 'controllers/donate';
import express from 'express';
import { auth } from 'middlewares/auth.middleware';
const router = express.Router();

router.get('/search', campaignController.getByQuery);
router.get('/owner/:userId', campaignController.getByAuthor);
router.get('/status/:status', campaignController.getByStatus);
router.get('/:slug', campaignController.getBySlug);
router.get('/info/summary', campaignController.getSummary);
router.get('/:campaignId/comments', getCommentByCampaignId);
router.post('/', auth, campaignController.createOne);
router.post('/:campaignId/donate', auth, DonateController.donate);
router.put('/:campaignId/active', auth, campaignController.activeOne);
router.put('/:campaignId/end', auth, campaignController.endOne);
router
  .route('/:campaignId')
  .put(auth, campaignController.updateOne)
  .delete(auth, campaignController.deleteOne);

export default router;
