const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const authClient = require("../grpc/auth.client");
// REGISTER
const registerUser = asyncHandler(async (req, res) => {
  authClient.Register(req.body, (err, data) => {
    if (err) return res.status(400).json({ message: err.details });
    res.status(201).json(data);
  });
});

// LOGIN
const authUser = asyncHandler(async (req, res) => {
  authClient.Login(req.body, (err, data) => {
    if (err) return res.status(401).json({ message: err.details });
    res.json(data);
  });
});

//serch users
const searchUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } }) // exclude self
    .select("-password");

  res.json(users);
};

module.exports = { registerUser, authUser, searchUsers };
