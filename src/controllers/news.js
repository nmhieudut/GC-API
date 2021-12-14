import { New } from 'models/New';

export const newsController = {
  getAll: async (req, res, next) => {
    try {
      const news = await New.find();
      res.status(200).json({ news });
    } catch (e) {
      next(e);
    }
  },
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const news = await New.findById(id);
      res.status(200).json({ news });
    } catch (e) {
      next(e);
    }
  }
};
