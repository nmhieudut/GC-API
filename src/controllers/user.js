import { User } from 'models/User';
import { errorMessage } from 'constants/error';

export const userController = {
  getMany: async (req, res, next) => {
    try {
    } catch (e) {
      next(e);
    }
  },
  update: async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { userId: updatedUserId } = req.params;
      console.log('dsadasasdasd', userId, updatedUserId, role);
      if (role !== 'admin' && updatedUserId !== userId) {
        const err = new Error(errorMessage.FORBIDDEN);
        err.statusCode = 403;
        return next(err);
      }

      const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidator: true
      });
      return res.status(200).json({
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role
        }
      });
    } catch (e) {
      next(e);
    }
  },
  remove: async (req, res, next) => {
    try {
      const { userId, isAdmin } = req.body;
      await User.deleteOne({ _id: userId });
      res.status(200).json({
        message: 'OK'
      });
    } catch (e) {
      next(e);
    }
  }
};
