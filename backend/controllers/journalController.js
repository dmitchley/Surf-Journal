const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Journal = require("../models/journalModel");

// Get all Journals
// public with get req
// route is /api/journals
const getJournals = asyncHandler(async (req, res) => {
  const journals = await Journal.find();

  res.status(200).json({ message: "Here are all the Journals", journals });
});

// Get a single Journal
// public get req

const getSpecificJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findById(req.params.id);

  res.status(200).json({ message: "Here is the Journal", journal });
});

// Get a single Journal
// private get req

const getSpecificUserJournal = asyncHandler(async (req, res) => {
  // Get token from header
  token = req.headers.authorization.split(" ")[1];

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from the token
  const person = (req.user = await User.findById(decoded.id));

  const foundJournals = await Journal.find({ userId: person._id });

  res
    .status(200)
    .json({ message: "Here is all your personal Journals!", foundJournals });
});

// create journal
// public with post req
// route is /api/journals
const createJournal = asyncHandler(async (req, res) => {
  // Get token from header
  token = req.headers.authorization.split(" ")[1];

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from the token
  const person = (req.user = await User.findById(decoded.id));

  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add info");
  }

  const journal = await Journal.create({
    text: req.body.text,
    time: req.body.time,
    wave: req.body.wave,
    image: req.body.image,
    waveDirection: req.body.waveDirection,
    windDirection: req.body.windDirection,
    location: req.body.location,
    user: person.fullname,
    userId: person._id,
  });

  res.status(200).json({ message: "Journal Created", journal });
});

// Get all Journals
// public with put req
// route is /api/journals/:id
const updateJournal = asyncHandler(async (req, res) => {
  // Get token from header
  token = req.headers.authorization.split(" ")[1];

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from the token
  const person = (req.user = await User.findById(decoded.id));

  const journals = await Journal.findById(req.params.id);

  if (!journals) {
    res.status(400);
    throw new Error("No journal found");
  }
  const updatedJournal = await Journal.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: { text: "Lekker New Comment", user: person.name } } },
    { new: true }
  );

  res
    .status(200)
    .json({ message: `Journal Updated ${req.params.id} ${updatedJournal}` });
});

// Get all Journals
// public with put req
// route is /api/journals/:id
const deleteJournal = asyncHandler(async (req, res) => {
  const journals = await Journal.findById(req.params.id);

  if (!journals) {
    res.status(400);
    throw new Error("No journal found");
  }
  await Journal.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: `Journal deleted ${req.params.id} ` });
});

// Get all Journals
// public with put req
// route is /api/journals/:id
const addComment = asyncHandler(async (req, res) => {
  // Get token from header
  token = req.headers.authorization.split(" ")[1];

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from the token
  const person = (req.user = await User.findById(decoded.id));

  const journals = await Journal.findById(req.params.id);

  if (!journals) {
    res.status(400);
    throw new Error("No journal found");
  }
  const updatedJournal = await Journal.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: { text: req.body.text, user: person.fullname } } },
    { new: true }
  );

  res
    .status(200)
    .json({ message: `Journal Updated ${req.params.id} ${updatedJournal}` });
});

module.exports = {
  getJournals,
  getSpecificJournal,
  createJournal,
  updateJournal,
  deleteJournal,
  addComment,
  getSpecificUserJournal,
};
