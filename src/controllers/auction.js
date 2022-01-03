import { responseErrorMessage } from 'constants/error';
import { Auction } from 'models/Auction';
import { User } from 'models/User';
import { Bid } from 'models/Bid';

export const AuctionController = {
  getAll: async (req, res, next) => {
    try {
      const { status } = req.query;
      let auctions;
      if (status === 'all') {
        auctions = await Auction.find({})
          .sort('-createdAt')
          .populate('author', 'name picture')
          .populate({
            path: 'currentBid',
            model: 'Bid',
            populate: { path: 'author', model: 'User', select: 'name picture' }
          })
          .limit(6);
      } else {
        auctions = await Auction.find({ status })
          .sort('-createdAt')
          .populate('author', 'name picture')
          .populate({
            path: 'currentBid',
            model: 'Bid',
            populate: { path: 'author', model: 'User', select: 'name picture' }
          })
          .limit(6);
      }
      res.status(200).json({
        auctions
      });
    } catch (e) {
      next(e);
    }
  },
  getById: async (req, res, next) => {
    try {
      const { auctionId } = req.params;
      const auction = await Auction.findById(auctionId)
        .populate('author', 'name picture')
        .populate('campaign', 'name slug')
        .populate({
          path: 'currentBid',
          model: 'Bid',
          populate: { path: 'author', model: 'User', select: 'name picture' }
        })
        .populate({
          path: 'bids',
          model: 'Bid',
          populate: {
            path: 'author',
            model: 'User',
            select: 'name picture'
          }
        });
      res.status(200).json({
        auction
      });
    } catch (e) {
      next(e);
    }
  },
  createOne: async (req, res, next) => {
    try {
      const newAuction = new Auction({
        ...req.body,
        author: req.user.userId
      });
      await newAuction.save();
      res.status(201).json({
        message: 'Phiên đấu giá được tạo thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  updateOne: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { auctionId } = req.params;
      const auction = await Auction.findById(auctionId);
      if (auction.authorId !== userId && role !== 'admin') {
        throw new Error(responseErrorMessage.FORBIDDEN);
      }
      await Auction.findByIdAndUpdate(auctionId, { ...req.body });
      res.status(200).json({
        message: 'Cập nhật thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  bidOne: async (req, res, next) => {
    // user
    try {
      const { userId } = req.user;
      const { auctionId } = req.params;
      const { amount } = req.body;
      const auction = await Auction.findById(auctionId)
        .populate('author')
        .populate('campaign')
        .populate({
          path: 'currentBid',
          model: 'Bid',
          populate: { path: 'author', model: 'User', select: 'name picture' }
        });
      const now = new Date();
      // check if auction is expired
      if (auction.finishedAt < now) {
        const err = new Error(responseErrorMessage.AUCTION_EXPIRED);
        err.statusCode = 400;
        return next(err);
      }
      if (auction.author._id === userId) {
        const err = new Error(responseErrorMessage.FORBIDDEN_BID);
        err.statusCode = 400;
        return next(err);
      }

      if (
        auction.currentBid &&
        auction.currentBid.author._id.toString() === userId
      ) {
        const err = new Error(responseErrorMessage.DUPLICATED_BID);
        err.statusCode = 400;
        return next(err);
      }
      if (amount <= auction.startPrice) {
        const err = new Error(responseErrorMessage.INVALID_BID);
        err.statusCode = 400;
        return next(err);
      }
      if (auction.currentBid && auction.currentBid.amount >= amount) {
        const err = new Error(responseErrorMessage.INVALID_CURRENT_BID);
        err.statusCode = 400;
        return next(err);
      }

      const user = await User.findById(userId);
      if (user.balance < amount) {
        const err = new Error(responseErrorMessage.INSUFFICIENT_BALANCE);
        err.statusCode = 400;
        return next(err);
      }

      if (auction.currentBid) {
        const lastBid = await Bid.findById(auction.currentBid._id);
        await User.findByIdAndUpdate(lastBid.author, {
          $inc: {
            balance: lastBid.amount
          }
        });
      }
      user.balance -= amount;
      await user.save();

      const newBid = await Bid.create({
        amount,
        author: userId,
        auctionId
      });
      // update current bid and unshift new bid to bids
      await Auction.findByIdAndUpdate(auctionId, {
        $set: {
          currentBid: newBid
        },
        $push: {
          bids: newBid._id
        }
      });

      res.status(200).json({
        message: 'Đấu giá thành công'
      });
    } catch (e) {
      next(e);
    }
  },
  deleteOne: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { auctionId } = req.params;
      const auction = await Auction.findById(auctionId);
      if (auction.authorId !== userId && role !== 'admin') {
        throw new Error(responseErrorMessage.FORBIDDEN);
      }
      await Auction.findByIdAndDelete(auctionId);
      res.status(200).json({
        message: 'Xóa thành công'
      });
    } catch (e) {
      next(e);
    }
  }
};
