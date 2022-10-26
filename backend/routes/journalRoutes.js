const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "../uploads/" });

const {
  getJournals,
  createJournal,
  updateJournal,
  getSpecificJournal,
  deleteJournal,
  addComment,
  getSpecificUserJournal,
} = require("../controllers/journalController");

// get all journals

router.get("/", getJournals);

// get all personal journals

router.get("/myJournals", getSpecificUserJournal);

// get Specific journals

router.route("/:id").get(getSpecificJournal);

// post journals with image

router.post("/", upload.single("image"), createJournal);

// put request for users to add images to a journal

router.put("/comment/:id", addComment);

// update journal and delete which are found by id

router.route("/:id").put(updateJournal).delete(deleteJournal);

module.exports = router;
