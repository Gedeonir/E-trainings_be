const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// Declare the Schema of the Mongo model

var memberSchema = new mongoose.Schema(
  {
    fullNames: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    isMarried:{
      type:Boolean,
      required:true
    },
    yearOfMarriage:{
      type:Number,
      default:null
    },
    password: {
      type: String,
      required: true,
    },
    memberCategory: {
      type: String,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default:"",
    },
    district: {
      type: String,
    },
    church: {
      type: String,
    },
    enrolledCourses:[
      {
        course:{ type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
        totalLessonsCompleted:[
          {type: mongoose.Schema.Types.ObjectId, ref: "Lessons"}
        ]
      },
      { _id : false }
    ],
    passwordChangedAt: Date,
    passwordResetCode: Number,
    passwordResetExpires: Date,
    verifyContactCode:Number
  },
  {
    timestamps: true,
  }
);

memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
memberSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

memberSchema.methods.createPasswordResetToken = async function () {
  this.passwordResetCode = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return this.passwordResetCode;
};

memberSchema.methods.createVerificationCode=async function(){
  this.verifyContactCode=Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

  return this.verifyContactCode;
}



//Export the model
module.exports = mongoose.model("Members", memberSchema);
