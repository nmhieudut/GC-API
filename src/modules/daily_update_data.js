import { compareDesc } from 'date-fns';
import { Auction } from 'models/Auction';
import { Campaign } from 'models/Campaign';
import { Donation } from 'models/Donation';
export const dailyUpdate = async () => {
  const now = new Date();
  const campaigns = await Campaign.find({});
  // update campaign status if finishedAt is more than now
  campaigns.forEach(async campaign => {
    try {
      if (
        compareDesc(now, new Date(campaign.finishedAt)) === -1 &&
        campaign.status === 'active'
      ) {
        campaign.status = 'ended';
        await campaign.save();
      }
    } catch (e) {
      next(e);
    }
  });
};

// auction ended if finishedAt is more than now
export const updateAuction = async () => {
  const now = new Date();
  const auctions = await Auction.find({})
    .populate('campaign')
    .populate('author')
    .populate('currentBid');
  // update campaign status if finishedAt is more than now
  auctions.forEach(async auction => {
    try {
      if (
        compareDesc(now, new Date(auction.finishedAt)) === -1 &&
        auction.status === 'active'
      ) {
        // check if auction has bids, if not set status to ended and failed to bid
        auction.status = 'ended';
        if (!auction.currentBid) {
          auction.result = 'failed';
          await auction.save();
          return;
        }
        auction.result = 'success';
        await auction.save();
        const campaign = await Campaign.findById(auction.campaign._id);
        campaign.amount += auction.currentBid.amount;
        await campaign.save();
        await Donation.create({
          amount: auction.currentBid.amount,
          donator: auction.author._id,
          campaignId: auction.campaign._id,
          message: 'Đấu giá thành công',
          donatedType: 'auction',
          action: 'thu'
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
};
