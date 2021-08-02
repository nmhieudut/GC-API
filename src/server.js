// const config = require("config");
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
const app = express();

import logger from "./middlewares/logger";
import cors from "./middlewares/cors";

import "./config/db";
require("dotenv").config();

// Routes
import auth from "./routes/auth";
import posts from "./routes/posts";

// Error handler
import { errorHandler } from "./middlewares/errors/errorHandler";

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
