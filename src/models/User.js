import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String
    },
    displayName: {
      type: String,
      trim: true,
      required: [true, "Display name must be required"]
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Username must be required"]
    },
    password: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Password must be required"],
      minlength: [6, "Password must be at least 6 characters"]
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let user = this;
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export { User };
