import { New } from 'models/New';

export const newsController = {
  getAll: async (req, res, next) => {
    try {
      const { skip, page } = req.query;
      const perPage = skip ? parseInt(skip) : 5;
      const news = await New.find()
        .skip(Number.parseInt(perPage) * Number.parseInt(page))
        .limit(perPage);
      res.status(200).json({ news });
    } catch (e) {
      next(e);
    }
  },
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const news = await New.findById(id);
      if (!news) {
        res.status(404).json({ message: 'Not found' });
      }
      res.status(200).json({ news });
    } catch (e) {
      next(e);
    }
  }
};
