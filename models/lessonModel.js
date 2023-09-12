const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model

var lessonSchema = new mongoose.Schema(
  {
    Course:{
      type: mongoose.Schema.Types.ObjectId, ref: "Courses"
    },
    lessonTitle: {
      type: String,
      required: true,
    },
    lessonVideoId: {
      type: String,
    },
    Notes: {
        type: String,
        required: true,
    },
    completedBy: [{
      member:{type: mongoose.Schema.Types.ObjectId, ref: "Trainees"},
    },{ _id : false }],

  },
  {
    timestamps: true,
  }
);


//Export the model
module.exports = mongoose.model("Lessons", lessonSchema);