import { responseErrorMessage } from 'constants/error';

const adminGuard = (req, res, next) => {
  if (req.user.role !== 'admin') {
    const err = new Error(responseErrorMessage.FORBIDDEN);
    err.statusCode = 403;
    return next(err);
  }
  next();
};

export { adminGuard };
