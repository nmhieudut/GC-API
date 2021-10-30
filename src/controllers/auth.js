import { User } from "models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import admin from "config/firebase";
import { jwt_key } from "utils/settings";
import { errorInputMessage, errorMessage } from "constants/error";

const register = async (req, res, next) => {
  try {
    const existedUser = await User.findOne({ email: req.body.email });
    if (existedUser) {
      const err = new Error(errorInputMessage.EXISTED_EMAIL);
      err.statusCode = 400;
      return next(err);
    }
    const user = await User.create(req.body);
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      jwt_key
    );
    res.status(200).json({
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isAdmin: user.isAdmin
      }
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const err = new Error(errorInputMessage.WRONG_EMAIL);
      err.statusCode = 400;
      return next(err);
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        jwt_key
      );
      res.status(200).json({
        token,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          email: user.email,
          name: user.name,
          picture: user.picture,
          isAdmin: user.isAdmin
        }
      });
    } else {
      const err = new Error(errorInputMessage.WRONG_PASSWORD);
      err.statusCode = 400;
      return next(err);
    }
  } catch (e) {
    next(e);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    let data = null;
    if (req.user) {
      const user = await User.findOne({ _id: req.user.userId });
      data = {
        id: user._id,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        name: user.name,
        picture: user.picture,
        isAdmin: user.isAdmin
      };
    }
    res.status(200).json({
      data
    });
  } catch (e) {
    next(e);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { name, email, picture } = decodedToken;
    User.findOne({ email }).exec(async (err, user) => {
      if (err) {
        let error = new Error(errorMessage.INTERNAL_SERVER_ERROR);
        error.statusCode = 500;
        return next(error);
      } else {
        if (user) {
          const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            jwt_key
          );
          return res.status(200).json({
            token,
            user
          });
        } else {
          let customPassword = email + name;
          let newUser = new User({
            name,
            email,
            password: customPassword,
            picture
          });
          const createdUser = await newUser.save();
          const token = jwt.sign(
            { userId: createdUser._id, isAdmin: user.isAdmin },
            jwt_key
          );
          return res.status(200).json({
            token,
            user: {
              name,
              email,
              picture,
              phoneNumber,
              dateOfBirth,
              isAdmin
            }
          });
        }
      }
    });
  } catch (e) {
    next(e);
  }
};

const facebookLogin = async (req, res, next) => {
  try {
    //  const {idToken} = req.
  } catch (e) {
    next(e);
  }
};

export { login, register, verifyUser, googleLogin, facebookLogin };
