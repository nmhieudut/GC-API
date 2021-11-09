import { campaignController } from 'controllers/campaign';
import { getCommentByCampaignId } from 'controllers/comment';
import express from 'express';
import { verifyToken } from 'middlewares/verifyToken';
const router = express.Router();

router.get('/search', campaignController.getByQuery);
router.get('/own/:userId', verifyToken, campaignController.getByAuthor);
router.post('/', verifyToken, campaignController.createOne);

router.route('/:slug').get(campaignController.getBySlug);
router
  .route('/:campaignId')
  .put(verifyToken, campaignController.updateOne)
  .delete(verifyToken, campaignController.deleteOne);

router.get('/:campaignId/comments', getCommentByCampaignId);
router.put('/:campaignId/active', verifyToken, campaignController.activeOne);
router.put('/:campaignId/end', verifyToken, campaignController.endOne);

export default router;
