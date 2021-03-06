import { Auction } from 'models/Auction';
import { User } from 'models/User';
import mongoose from 'mongoose';
require('dotenv').config();
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const connect = async ({ io }) => {
  try {
    await mongoose.connect(process.env.DB_URI, connectionParams);
    console.log('Connected to DB');
    const AuctionChangeStream = Auction.collection.watch({
      fullDocument: 'updateLookup'
    });
    AuctionChangeStream.on('change', async change => {
      console.log('change', change);
      const auction = await Auction.findById(change.documentKey._id)
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
      io.emit('auction-change', {
        type: change.operationType,
        auction
      });
    });
  } catch (error) {
    console.log('Error happened when connect to DB: ', error);
    process.exit(1);
  }
};
export { connect };
