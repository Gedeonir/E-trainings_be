const Quizzes=require("../models/quizzModel");
const QuizzesQuestions=require("../models/quizzQuestions")
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Course=require("../models/coursesModel");

const addQuizz=asyncHandler(async(req,res)=>{
    const {course} = req.params
    validateMongoDbId(course);

    const{
        QuizName,
        duration
    }=req.body



    if(!QuizName || !duration) throw new Error("All fields are required")

    const verifyIfAnotherExamExists=await Quizzes.find({Course:course});

    if (verifyIfAnotherExamExists.length>0) {
        throw new Error("Course has Exam already, to add new One you must delete it.")
    }

    const getCourse=await Course.findOne({_id:course});

    if(!getCourse) throw new Error("Course no longer Exists");
    if(await Quizzes.findOne({QuizName,Course:course})) throw new Error("Lesson already exists")
    else{
        const newQuizz= await Quizzes.create({
            Course:getCourse._id,
            QuizName,
            duration,
            
        });


        res.json({
            message:`new exam "${newQuizz.QuizName}" is added to this course`,
        })
    }

})

const getCourseQuizzes=asyncHandler(async(req,res)=>{
    const {course}=req.params;
    validateMongoDbId(course);

    try {
        const getQuizzes=await Quizzes.find({Course:course}).populate("Course")
        res.json(getQuizzes);
    } catch (error) {
        throw new Error(error)
    }

})

const getOneQuiz=asyncHandler(async(req,res)=>{
    const {quizz}=req.params;
    validateMongoDbId(quizz)

    const {course}=req.params;
    validateMongoDbId(course);

    try {
        const getQuizz= await Quizzes.findOne({_id:quizz,Course:course}).populate("Course")
        res.json({
            getQuizz
        })
    } catch (error) {
        throw new Error(error)
    }


})

const getQuizzQuestion=asyncHandler(async(req,res)=>{
    const {quizz}=req.params;
    validateMongoDbId(quizz);

    try {
        const getQuestions=await QuizzesQuestions.find({Quizz:quizz}).populate("Quizz")
        res.json(getQuestions);
    } catch (error) {
        throw new Error(error)
    }

})


const addQuizzQuestions=asyncHandler(async(req,res)=>{
    const {quizz}=req.params;
    validateMongoDbId(quizz);

    
    const{
        question,
        solution,
        alternateSolution1,
        alternateSolution2,
        alternateSolution3
    }=req.body

    if(!question || !solution ||!alternateSolution1 ||!alternateSolution2 ||!alternateSolution3) throw new Error("All fields are required")


    const getQuizz=await Quizzes.findOne({_id:quizz});

    if(!getQuizz) throw new Error("Quizz no longer Exists");

    if(await QuizzesQuestions.findOne({question:question,Quizz:quizz})) throw new Error("question already exists")
    else{
        const newQuizzQuestion= await QuizzesQuestions.create({
            Quizz:getQuizz._id,
            question,
            solution,
            alternateSolution1,
            alternateSolution2,
            alternateSolution3
            
        });


        res.json({
            message:`new question "${newQuizzQuestion.question}" is added to this exam`,
        })
    }

})

const markTheQuizz=asyncHandler(async(req,res)=>{
    const answers=req.body;

    const { _id } = req.user;
    validateMongoDbId(_id);

    const {quizz} = req.params;
    validateMongoDbId(quizz);
    const findQuizz= await Quizzes.findOne({_id:quizz});
  
    if (!findQuizz) throw new Error("This Quizz is no longer available"); 

    const getCourse=await Course.findOne({_id:findQuizz.Course})


    const getQuestions=await QuizzesQuestions.find({Quizz:quizz}).populate("Quizz")
    const passMark=Math.round((getQuestions.length)/2)  
    
    

    try {

        const data =findQuizz?.completedBy
        
        const filteredData = data?.filter(item => item?.member?.equals(_id));

        if(filteredData.length > 0 ) {
            throw new Error("You have already submitted this quizz")
        }

        let marks=0
        const calculateMarks=await Promise.all(answers.map(async(answer)=>{
            const oneAnswer=await QuizzesQuestions.findOne({_id:answer.question});
    
            marks +=oneAnswer.solution ==answer.answer?1:0
        }))

        findQuizz?.completedBy.push({
            member:_id,
            score:marks,
            at:new Date()
        });
      
          
        await findQuizz.save();

        if (marks>=passMark) {
            getCourse?.completedBy.push({
                member:_id
            })

            await getCourse.save();

            res.json({
                message:`Thank you for submitting your work. The pass mark was ${passMark}/${getQuestions.length} and you have got ${marks}/${getQuestions.length}
                Congratulations!!!`
            })
        }else{
            res.json({message:`Thank you for submitting your work but unfortunately you did not meet required pass mark. The pass mark was ${passMark}/${getQuestions.length} and you have got ${marks}/${getQuestions.length}`})
        }
       
    
    } catch (error) {
        throw new Error(error)
    }
})


module.exports={
    addQuizz,
    getCourseQuizzes,
    addQuizzQuestions,
    getQuizzQuestion,
    markTheQuizz,
    getOneQuiz
}