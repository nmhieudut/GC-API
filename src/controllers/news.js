import { New } from 'models/New';

export const newsController = {
  getAll: async (req, res, next) => {
    try {
      const news = await New.find();
      res.status(200).json({ news });
    } catch (e) {
      next(e);
    }
  }
};
