const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const grpc = require("@grpc/grpc-js");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

/* ================= REGISTER ================= */
const registerHandler = async (call, callback) => {
  try {
    const { name, email, password } = call.request;

    const userExists = await User.findOne({ email });
    if (userExists)
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: "User already exists",
      });

    const user = await User.create({ name, email, password });

    callback(null, {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

/* ================= LOGIN ================= */
const loginHandler = async (call, callback) => {
  try {
    const { email, password } = call.request;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return callback({
        code: grpc.status.UNAUTHENTICATED,
        message: "Invalid email or password",
      });
    }

    callback(null, {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

/* ================= GET USER (BY ID) ================= */
const getUserHandler = async (call, callback) => {
  try {
    const { userId } = call.request;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "User not found",
      });
    }

    callback(null, {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      pic: user.pic,
    });
  } catch (err) {
    callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

module.exports = { loginHandler, registerHandler, getUserHandler };
