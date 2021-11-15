import { Wallet } from 'models/Wallet';

export const WalletController = {
  getAll: async (req, res, next) => {
    try {
      console.log('--------herere');
      const wallets = await Wallet.find({ owner: req.user.userId });
      return res.status(200).json({
        wallets
      });
    } catch (error) {
      return next(error);
    }
  },
  createOne: async (req, res, next) => {
    try {
      await Wallet.create({ owner: req.user.userId });
      return res.status(201).json({
        message: 'Tạo ví thành công'
      });
    } catch (error) {
      return next(error);
    }
  },
  charge: async (req, res, next) => {
    try {
      const { balance } = req.body;
      const { walletId } = req.params;
      const { userId } = req.user;
      const wallet = await Wallet.findOne({ _id: walletId });
      if (
        userId === String(wallet.owner) ||
        (userId !== String(wallet.owner) && isAdmin === true)
      ) {
        wallet.balance += balance;
        await wallet.update();
        return res.status(201).json({
          message: 'Nạp tiền vào ví thành công.'
        });
      }
    } catch (error) {
      return next(error);
    }
  },
  editOne: async (req, res, next) => {},
  deleteOne: async (req, res, next) => {
    const { walletId } = req.params;
    try {
      await Wallet.findByIdAndUpdate(
        { _id: walletId },
        { deleted_at: Date.now() }
      );
      return res.status(201).json({
        message: 'Xóa ví thành công'
      });
    } catch (error) {
      return next(error);
    }
  }
};
