import bcrypt from 'bcrypt';
import admin from 'config/firebase';
import { requestErrorMessage, responseErrorMessage } from 'constants/error';
import jwt from 'jsonwebtoken';
import { User } from 'models/User';
import { jwt_key } from 'utils/settings';

const register = async (req, res, next) => {
  try {
    const existedUser = await User.findOne({ email: req.body.email });
    if (existedUser) {
      const err = new Error(requestErrorMessage.EXISTED_EMAIL);
      err.statusCode = 400;
      return next(err);
    }
    const newUser = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const user = await newUser.save();
    const token = jwt.sign({ userId: user._id, role: user.role }, jwt_key);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        balance: user.balance
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
      const err = new Error(requestErrorMessage.WRONG_EMAIL);
      err.statusCode = 400;
      return next(err);
    }
    // check if user is not activated
    if (user.isActive === false) {
      const err = new Error(requestErrorMessage.NOT_ACTIVATED);
      err.statusCode = 400;
      return next(err);
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ userId: user._id, role: user.role }, jwt_key);
      res.status(200).json({
        token,
        user: {
          id: user._id,
          phoneNumber: user.phoneNumber,
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role,
          balance: user.balance
        }
      });
    } else {
      const err = new Error(requestErrorMessage.WRONG_PASSWORD);
      err.statusCode = 400;
      return next(err);
    }
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'You are logged out'
    });
  } catch (e) {
    next(e);
  }
};

const getCurrentUser = async (req, res, next) => {
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
        role: user.role,
        balance: user.balance
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
    console.log('---', decodedToken);
    User.findOne({ email }).exec(async (err, user) => {
      if (err) {
        let error = new Error(responseErrorMessage.INTERNAL_SERVER_ERROR);
        error.statusCode = 500;
        return next(error);
      } else {
        if (user) {
          if (user.isActive === false) {
            const err = new Error(requestErrorMessage.NOT_ACTIVATED);
            err.statusCode = 400;
            return next(err);
          }
          const token = jwt.sign(
            { userId: user._id, role: user.role },
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
            { userId: createdUser._id, role: createdUser.role },
            jwt_key
          );
          return res.status(200).json({
            token,
            user: {
              name,
              email,
              picture,
              phoneNumber: createdUser.phoneNumber,
              role: createdUser.role,
              balance: createdUser.balance
            }
          });
        }
      }
    });
  } catch (e) {
    next(e);
  }
};

export { login, register, getCurrentUser, googleLogin, logout };
