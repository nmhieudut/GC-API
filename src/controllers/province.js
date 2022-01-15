import axios from 'axios';

export const ProvinceController = {
  getAll: async (req, res, next) => {
    try {
      const response = await axios.get(`${process.env.PROVINCE_URL}/province`);
      res.status(200).json({
        results: response.data.results
      });
    } catch (e) {
      next(e);
    }
  },
  getDistrictsById: async (req, res, next) => {
    try {
      const response = await axios.get(
        `${process.env.PROVINCE_URL}/province/district/${req.params.provinceId}`
      );
      res.status(200).json({
        results: response.data.results
      });
    } catch (e) {
      next(e);
    }
  },
  getWardsById: async (req, res, next) => {
    try {
      const response = await axios.get(
        `${process.env.PROVINCE_URL}/province/ward/${req.params.provinceId}`
      );
      res.status(200).json({
        results: response.data.results
      });
    } catch (e) {
      next(e);
    }
  }
};
