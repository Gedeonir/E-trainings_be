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
    gender:{
      type:String
    },
    mobile: {
      type: String,
      required: true,
    },
    district: {
      type: String,
    },
    church: {
      type: String,
    },
    ID:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Members", memberSchema);
