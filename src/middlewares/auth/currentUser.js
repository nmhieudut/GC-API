import jwt from "jsonwebtoken";

const checkCurrentUser = (req, res, next) => {
  const Authorization = req.header("authorization");
  if (!Authorization) {
    req.user = null;
    next();
  } else {
    // Get token
    const token = Authorization.replace("Bearer ", "");
    try {
      // Verify
      const { userId } = jwt.verify(token, process.env.APP_SECRET);
      // Assign to req
      req.user = { userId };
      next();
    } catch {
      req.user = null;
      next();
    }
  }

  next();
};

export { checkCurrentUser };
