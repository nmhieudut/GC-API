import { Wallet } from "models/Wallet";

export const WalletController = {
  getAll: async (req, res, next) => {},
  createOne: async (req, res, next) => {
    try {
      const newWallet = await Wallet.create({ owner: req.user.userId });
      return res.status(201).json({
        wallet: newWallet
      });
    } catch (error) {
      return next(error);
    }
  },
  editOne: async (req, res, next) => {},
  deleteOne: async (req, res, next) => {}
};
