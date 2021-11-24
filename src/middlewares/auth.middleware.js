import { errorMessage } from 'constants/error';
import jwt from 'jsonwebtoken';
import { jwt_key } from 'utils/settings';

const auth = (req, res, next) => {
  const Authorization = req.header('authorization');
  if (!Authorization) {
    const err = new Error(errorMessage.UNAUTHORIZED);
    err.statusCode = 401;
    return next(err);
  }
  const token = Authorization.replace('Bearer ', '');
  const { userId, role } = jwt.verify(token, jwt_key);
  console.log(`user id: ${userId}, role: ${role}`);
  req.user = { userId, role };
  next();
};

export { auth };
