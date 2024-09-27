const asyncHandler = require("express-async-handler");
var jwt = require("jsonwebtoken");

const User = require("../models/userModel");

// Get all Users
// public with get req
// route is /api/user
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json({ message: "See All Users", users });
});

// create user
// public with post req
// route is /api/user
const createUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user
  const user = await User.create({
    fullname,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      fullname: user.fullname,
      email: user.email,
      token: generateToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// login user
//   fullname, email, password have to match otherwise throw an error

const loginUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  // check account details
  const user = await User.findOne({ fullname, email, password });

  if (user && user.password) {
    res.json({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      token: generateToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Login Data");
  }

  res.json({ message: "Lekker you logged in" });
});

// delete a user by their id

const deleteUser = asyncHandler(async (req, res) => {
  // Get token from header
  token = req.headers.authorization.split(" ")[1];

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from the token
  const person = await User.findById(decoded.id);

  console.log(person);

  if (!person) {
    res.status(400);
    throw new Error("No person found");
  }
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: `User deleted ${person} ` });
});

// profile page

const getMe = asyncHandler(async (req, res) => {
  const { _id, fullname, password, email, role } = await User.findById(
    req.user.id
  );
  res.status(200).json({
    id: _id,
    fullname,
    email,
    password,
    role,
  });
});

// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
  const updatedPassword = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedPassword);
});

// generate token jwt

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  getMe,
  deleteUser,
  updateUserPassword,
};
