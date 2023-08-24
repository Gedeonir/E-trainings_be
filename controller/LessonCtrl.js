const Lesson=require("../models/lessonModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Course=require("../models/coursesModel");

function isValidYouTubeLinkWithVideoId(input) {
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|u\/\w\/|embed\/|e\/\?v=|v=|watch\?v=|v\/|embeds\/\?v=|e\/|watch\?v=|v=)([^#\&\?]*).*/;
    
    try {
      const url = new URL(input);
      const match = url.href.match(youtubeRegex);
      return match && match[1] !== undefined;
    } catch (error) {
      return false;
    }
}

const addLesson=asyncHandler(async(req,res)=>{
    const {course} = req.params

    const{
        lessonTitle,
        lessonVideo,
        Notes
    }=req.body
    if(!lessonTitle || !lessonVideo || !Notes) throw new Error("All fields are required");

    if (!isValidYouTubeLinkWithVideoId(lessonVideo)) {
        throw new Error("Invalid link");
    }

    const getCourse=await Course.findOne({_id:course});

    if(!getCourse) throw new Error("Course no longer Exists");

    if(await Lesson.findOne({lessonTitle})) throw new Error("Lesson already exists")
    else{
        const newLesson= await Lesson.create({
            lessonTitle,
            lessonVideoId:lessonVideo.split('v=')[1],
            Notes,
            Course:getCourse._id
        });


        res.json({
            message:`new Lesson"${newLesson.lessonTitle}" is added to this course`,
        })
    }


})

const getCourseAllLessons=asyncHandler(async(req,res)=>{
    const {course} = req.params
    validateMongoDbId(course);
    try {
        const getAllLessons=await Lesson.find({Course:course}).populate("Course")
        res.json(getAllLessons);
    } catch (error) {
        throw new Error(error)
    }
})

const getOneLesson=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);

    const {course}=req.params;

    
    try {
        const getLesson= await Lesson.findOne({_id:id,Course:course}).populate("Course")
        res.json({
            getLesson
        })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteLesson=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);

    try {
        await Lesson.findByIdAndDelete(id)
        res.json({
            message:"Lesson deleted succesfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateLesson=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    
    const{
        lessonTitle,
        lessonVideoId,
        Notes
    }=req.body

    try {
        if(!lessonTitle || !lessonVideoId || !Notes) throw new Error("All fields are required");

        if(await Lesson.findOne({lessonTitle})) throw new Error("Lesson already exists")

        const updateLesson = await Lesson.findByIdAndUpdate(
            id,
            {
                lessonTitle,
                lessonVideoId,
                Notes
            },
            {
                new: true,
            }
        )

        res.json(updateLesson)
    } catch (error) {
     throw new Error(error)   
    }
})

module.exports={
    addLesson,
    getCourseAllLessons,
    getOneLesson,
    updateLesson,
    deleteLesson
}