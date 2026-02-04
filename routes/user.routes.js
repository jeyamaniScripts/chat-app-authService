const express = require("express");
const { registerUser, authUser, searchUsers } = require("../controllers/user.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/", protect, searchUsers);

module.exports = router;
