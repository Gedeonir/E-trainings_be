const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model

var tutorSchema = new mongoose.Schema(
  {
    fullNames: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Tutors", tutorSchema);
