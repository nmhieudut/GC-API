import { User } from "../models/User";

const update = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findByIdAndUpdate(
      userId,
      { ...req.body },
      { new: true, runValidator: true }
    );
    res.status(200).json({
      status: "sucess",
      data: {
        user: {
          id: user._id,
          displayName: user.displayName,
          avatar: user.avatar
        }
      }
    });
  } catch (e) {
    next(e);
  }
};

export { update };
