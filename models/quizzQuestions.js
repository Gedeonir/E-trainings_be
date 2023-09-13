const mongoose=require("mongoose")

const QuestionsSchema=new mongoose.Schema({

    Quizz:{
        type: mongoose.Schema.Types.ObjectId, ref: "Quizzes"
    },
    question:{
        type:String,
        required:true
    },
    solution:{
        type:String,
        required:true
    },
    alternateSolution1:{
        type:String,
        required:true
    },
    alternateSolution2:{
        type:String,
        required:true
    },
    alternateSolution3:{
        type:String,
        required:true
    }
    
},{
    timestamps: true,
  }
)

module.exports = mongoose.model("quizzQuestions", QuestionsSchema);