import { errorMessage } from "constants/error";
import jwt from "jsonwebtoken";
import { jwt_key } from "utils/settings";

const verifyToken = (req, res, next) => {
  const Authorization = req.header("authorization");
  if (!Authorization) {
    const err = new Error(errorMessage.UNAUTHORIZED);
    err.statusCode = 401;
    return next(err);
  }
  // Get token
  const token = Authorization.replace("Bearer ", "");
  // Verify
  const { userId } = jwt.verify(token, jwt_key);
  // Assign to req
  console.log("----", userId);
  req.user = { userId };
  next();
};

export { verifyToken };
