const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const Authorization = req.header("authorization");
  if (!Authorization) {
    const err = new Error("Unauthorized user!");
    err.statusCode = 401;
    return next(err);
  }
  // Get token
  const token = Authorization.replace("Bearer ", "");
  // Verify
  const { userId } = jwt.verify(token, process.env.APP_SECRET);
  // Assign to req
  req.user = { userId };
  next();
};
