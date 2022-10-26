const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "required"],
    },
    email: {
      type: String,
      required: [true, "required"],
    },
    role: {
      type: String,
      default: "user",
    },
    password: {
      type: String,
      required: [true, "required"],
    },
  },
  {
    timestamps: { createdAt: "created_at" },
  }
);

module.exports = mongoose.model("User", userSchema);
