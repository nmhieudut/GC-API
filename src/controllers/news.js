import { New } from 'models/New';

async function getAll(req, res, next) {
  try {
    const news = await New.find();
    res.status(200).json(news);
  } catch (e) {
    next(e);
  }
}
export { getAll };
