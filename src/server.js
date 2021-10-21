import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import "./config/db";
// Error handler
import { errorHandler } from "./middlewares/errors/errorHandler";
import logger from "./middlewares/logger";
// Routes
import auth from "./routes/auth";
// import campaign from "./routes/campaign";
import user from "./routes/user";
import news from "./routes/news";

const app = express();

require("dotenv").config();

// JSON parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Middleware
app.use(logger);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Green Charity APIs");
});

// Mounted the routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
// app.use("/api/v1/campaign", campaign);
app.use("/api/v1/news", news);
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
const PORT = process.env.PORT || 8080;

// Main app
app.listen(PORT, () => {
  console.log("Server is listening on port:", PORT);
});
