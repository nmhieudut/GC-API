import jwt from "jsonwebtoken";

const adminGuard = (req, res, next) => {
  const Authorization = req.header("authorization");
  if (!Authorization) {
    const err = new Error("Unauthorized user!");
    err.statusCode = 401;
    return next(err);
  }
  // Get token
  const token = Authorization.replace("Bearer ", "");
  // Verify
  const { userId, isAdmin } = jwt.verify(token, process.env.APP_SECRET);
  // Assign to req
  if (!isAdmin) {
    const err = new Error("Bạn không phải là admin!");
    err.statusCode = 403;
    return next(err);
  }
  req.user = { userId };
  next();
};

export { adminGuard };
