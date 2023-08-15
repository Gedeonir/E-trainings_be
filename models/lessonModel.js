const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model

var lessonSchema = new mongoose.Schema(
  {
    lessonTitle: {
      type: String,
      required: true,
    },
    lessonVideoId: {
      type: String,
      required: true,
    },
    Notes: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);


//Export the model
module.exports = mongoose.model("Lessons", lessonSchema);