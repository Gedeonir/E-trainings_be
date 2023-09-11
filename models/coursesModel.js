const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model

var courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    courseIconImage: {
      type: String,
    },

    courseTutors:{
      type: mongoose.Schema.Types.ObjectId, ref: "Tutors",
      required:true
    },

    courseCategory: {
        type: mongoose.Schema.Types.ObjectId, ref: "CourseCategories",
        required:true
    },
    enrolledTrainees: [{
      member:{type: mongoose.Schema.Types.ObjectId, ref: "Trainees"},
    },{ _id : false }],
    completedBy:[{member:{type: mongoose.Schema.Types.ObjectId, ref: "Trainees"}},{ _id : false }],
    popularityScore:{
      type:String
    },
    ratingsAndReviews: [
      {
        member:{type: mongoose.Schema.Types.ObjectId, ref: "Trainees"},
        review:{
            type:String
        },
        rating:{
            type:String
        }
      },
      { _id : false }
    ],
  },
  {
    timestamps: true,
  }
);


//Export the model
module.exports = mongoose.model("Courses", courseSchema);