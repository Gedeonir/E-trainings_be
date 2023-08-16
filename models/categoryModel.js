const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model

var categorySchema = new mongoose.Schema(
  {
    cetegoryName: {
      type: String,
      required: true,
      unique:true
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


//Export the model
module.exports = mongoose.model("CourseCategory", categorySchema);