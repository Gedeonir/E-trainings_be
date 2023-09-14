const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model

var quizzSchema = new mongoose.Schema(
  {
    Course:{
      type: mongoose.Schema.Types.ObjectId, ref: "Courses"
    },
    QuizName: {
      type: String,
    },
    duration:{
      type:String
    },
    isActive:{
      type:Boolean,
      default:false
    },
    completedBy: [{
      member:{type: mongoose.Schema.Types.ObjectId, ref: "Trainees"},
      score:{type:String},
      at:{type:String}
      
    },{ _id : false },{
      timestamps: true,
    }],

  },
  {
    timestamps: true,
  }
);


//Export the model
module.exports = mongoose.model("Quizzes", quizzSchema);