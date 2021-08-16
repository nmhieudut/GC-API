import { User } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
    res.status(200).json({
      status: "sucess",
      data: {
        token,
        user: { displayName: user.displayName, avatar: user.avatar }
      }
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      const err = new Error("User is not correct");
      err.statusCode = 400;
      return next(err);
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
      res.status(200).json({
        status: "success",
        data: {
          token,
          user: { displayName: user.displayName, avatar: user.avatar }
        }
      });
    } else {
      const err = new Error("Password is not correct");
      err.statusCode = 400;
      return next(err);
    }
  } catch (e) {
    next(e);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const data = { user: null };
    if (req.user) {
      const user = await User.findOne({ _id: req.user.userId });
      data.user = { displayName: user.displayName, avatar: user.avatar };
    }
    res.status(200).json({
      status: "success",
      data: data
    });
  } catch (e) {
    next(e);
  }
};

export { login, register, getCurrentUser };
