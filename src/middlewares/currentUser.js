import jwt from "jsonwebtoken";

const checkCurrentUser = (req, res, next) => {
  const Authorization = req.headers.authorization;
  if (!Authorization) {
    req.user = null;
    next();
  } else {
    // Get token
    const token = Authorization.replace("Bearer ", "");
    try {
      const { userId } = jwt.verify(token, process.env.APP_SECRET);
      req.user = { userId };
      next();
    } catch {
      req.user = null;
      next();
    }
  }
};

export { checkCurrentUser };
