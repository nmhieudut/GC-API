import { Wallet } from 'models/Wallet';

export const WalletController = {
  getAll: async (req, res, next) => {},
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
  editOne: async (req, res, next) => {},
  deleteOne: async (req, res, next) => {}
};
