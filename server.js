// const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const app = express();

const logger = require("./src/middlewares/logger");
const cors = require("./src/middlewares/cors");

require("./src/config/db");
require("dotenv").config();

// Routes
const auth = require("./src/routes/auth");
const posts = require("./src/routes/posts");

// Error handler
const { errorHandler } = require("./src/middlewares/errors/errorHandler");

// JSON parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Logger middleware
app.use(logger);
app.use(cors);

// Mounted the routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/posts", posts);

app.all("*", (req, res, next) => {
  const err = new Error("Invalid route");
  err.statusCode = 404;
  next(err);
});
app.use(errorHandler);
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Development");
}
const PORT = process.env.PORT || 3000;

// Main app
app.listen(PORT, () => {
  console.log("Server is listening on port:", PORT);
});
