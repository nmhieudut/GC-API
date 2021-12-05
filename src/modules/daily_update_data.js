import { compareDesc } from 'date-fns';
import { Campaign } from 'models/Campaign';

export const dailyUpdate = async () => {
  const now = new Date();
  const campaigns = await Campaign.find({});
  // update campaign status if finishedAt is more than now
  campaigns.forEach(async campaign => {
    try {
      if (compareDesc(now, new Date(campaign.finishedAt)) === -1) {
        campaign.status = 'ended';
        await campaign.save();
      }
    } catch (e) {
      next(e);
    }
  });
};
