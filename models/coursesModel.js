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
    enrolledMembers: [{type: mongoose.Schema.Types.ObjectId, ref: "Members"}, { _id : false }],
    ratingsAndReviews: [
      {
        member:{type: mongoose.Schema.Types.ObjectId, ref: "Members"},
        review:{
            type:String
        },
        rating:{
            type:String
        }
      },
      { _id : false }
    ],
    courseIcon: {
      type: String,
      required: true,
    },

    courseTutor: [
      {
      type: mongoose.Schema.Types.ObjectId, ref: "Tutors",
      required:true
      },
      { _id : false }
    ],   
    courseCategory: {
        type: mongoose.Schema.Types.ObjectId, ref: "CourseCategory",
        required:true
    },
  },
  {
    timestamps: true,
  }
);


//Export the model
module.exports = mongoose.model("Courses", courseSchema);