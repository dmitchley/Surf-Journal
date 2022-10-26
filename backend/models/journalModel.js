const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};
// journal schema show the journal data and the other users images
const journalSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "required"],
    },
    time: {
      type: String,
    },

    wave: {
      type: String,
    },
    wave: {
      type: String,
    },
    waveDirection: {
      type: String,
    },
    windDirection: {
      type: String,
    },
    location: {
      type: String,
    },
    image: {
      type: String,
    },
    user: {
      type: String,
    },
    userId: {
      type: String,
    },
    comments: [
      {
        text: String,
        user: String,
      },
    ],
  },

  {
    timestamps: { createdAt: "created_at" },
  }
);

module.exports = mongoose.model("Journal", journalSchema);
