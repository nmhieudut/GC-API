import jwt from "jsonwebtoken";
import { jwt_key } from "../utils/settings";

const verifyCurrentUser = (req, res, next) => {
  const Authorization = req.headers.authorization;
  if (!Authorization) {
    req.user = null;
    next();
  } else {
    // Get token
    const token = Authorization.replace("Bearer ", "");
    try {
      const { userId } = jwt.verify(token, jwt_key);
      req.user = { userId };
      next();
    } catch {
      req.user = null;
      next();
    }
  }
};

export { verifyCurrentUser };
