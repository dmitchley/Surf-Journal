const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  loginUser,
  getMe,
  deleteUser,
} = require("../controllers/userController");
// only see your personal items middleware
const { protect } = require("../middleware/authMiddleware");
// only the admin can access middleware
const { protectAdmin } = require("../middleware/adminMiddleware");

// only the admin can see all of the users
router.get("/", protectAdmin, getUsers);

// see your personal data

router.get("/me", protect, getMe);

// register route

router.route("/register").post(createUser);

// login route

router.route("/login").post(loginUser);

// only the admin can delete all of the users

router.delete("/:id", protectAdmin, deleteUser);

module.exports = router;
