import { User } from "models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import admin from "config/firebase";
import { jwt_key } from "utils/settings";

const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ userId: user._id }, jwt_key);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
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
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      const err = new Error("User is not correct");
      err.statusCode = 400;
      return next(err);
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ userId: user._id }, jwt_key);
      res.status(200).json({
        token,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          name: user.name,
          picture: user.picture,
          isAdmin: user.isAdmin
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

const verifyUser = async (req, res, next) => {
  try {
    let data = null;
    if (req.user) {
      const user = await User.findOne({ _id: req.user.userId });
      data = {
        id: user._id,
        phoneNumber: user.phoneNumber,
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
        let error = new Error("Something went wrong");
        error.statusCode = 400;
        return next(error);
      } else {
        if (user) {
          const token = jwt.sign({ userId: user._id }, jwt_key);
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
          const token = jwt.sign({ userId: createdUser._id }, jwt_key);
          return res.status(200).json({
            token,
            user: {
              name,
              email,
              picture,
              phoneNumber,
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
