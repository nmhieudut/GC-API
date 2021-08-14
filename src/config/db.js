import mongoose from "mongoose";
require("dotenv").config();

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

mongoose
  .connect(process.env.DB_URI, connectionParams)
  .then(() => console.log("Connected to DB"))
  .catch(error => {
    console.log("Error happened when connect to DB: ", error);
    process.exit(1);
  });
