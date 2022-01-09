import { campaignController } from 'controllers/campaign';
import { getCommentByCampaignId } from 'controllers/comment';
import { DonateController } from 'controllers/donate';
import express from 'express';
import { auth } from 'middlewares/auth.middleware';
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Campaign
 *  description: Campaign management
 */

/**
 * @swagger
 * /campaigns/search:
 *  get:
 *    description: Use to request all campaigns
 *    tags: [Campaign]
 *    parameters:
 *     - in: query
 *       name: q
 *       schema:
 *         type: string
 *       required: false
 *     - in: query
 *       name: page
 *       schema:
 *        type: number
 *     - in: query
 *       name: limit
 *       schema:
 *        type: number
 *    responses:
 *      '200':
 *        description: A successful response
 */

router.get('/search', campaignController.getByQuery);
router.get('/owner/:userId', campaignController.getByAuthor);
router.get('/status/:status', campaignController.getByStatus);
router.get('/:slug', campaignController.getBySlug);
router.get('/info/summary', campaignController.getSummary);
router.get('/:campaignId/comments', getCommentByCampaignId);
router.get('/:campaignId/donations', campaignController.getDonations);
router.post('/', auth, campaignController.createOne);
router.post('/:campaignId/donate', auth, DonateController.donate);
router.put('/:campaignId/active', auth, campaignController.activeOne);
router.put('/:campaignId/end', auth, campaignController.endOne);
router
  .route('/:campaignId')
  .put(auth, campaignController.updateOne)
  .delete(auth, campaignController.deleteOne);

export default router;
