import { campaignController } from 'controllers/campaign';
import { getCommentByCampaignId } from 'controllers/comment';
import express from 'express';
import { auth } from 'middlewares/auth.middleware';
const router = express.Router();

router.get('/search', campaignController.getByQuery);
router.get('/own/:userId', auth, campaignController.getByAuthor);
router.post('/', auth, campaignController.createOne);

router.route('/:slug').get(campaignController.getBySlug);
router
  .route('/:campaignId')
  .put(auth, campaignController.updateOne)
  .delete(auth, campaignController.deleteOne);

router.get('/:campaignId/comments', getCommentByCampaignId);
router.put('/:campaignId/active', auth, campaignController.activeOne);
router.put('/:campaignId/end', auth, campaignController.endOne);

export default router;
