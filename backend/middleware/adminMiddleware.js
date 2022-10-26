const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  token = req.headers.authorization.split(" ")[1];

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from the token
  const person = (req.user = await User.findById(decoded.id));

  if (person.role === "Admin") {
    console.log("Your are an admin");
    next();
  }

  if (person.role === "user") {
    throw new Error("Not authorized!");
  }
});

module.exports = { protectAdmin };
