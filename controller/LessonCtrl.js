const Lesson=require("../models/lessonModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Course=require("../models/coursesModel");

const addLesson=asyncHandler(async(req,res)=>{
    const {course} = req.params

    const{
        lessonTitle,
        lessonVideoId,
        Notes
    }=req.body


    try {

        const Course=await Course.findOne({_id:course});

        if(!Course) throw new Error("Course no longer Exists");

        if(!lessonTitle || !lessonVideoId || !Notes) throw new Error("All fields are required");

        if(await Lesson.findOne({lessonTitle})) throw new Error("Lesson already exists")

        const newLesson= await Lesson.create({
            lessonTitle,
            lessonVideoId,
            Notes,
            Course:Course._id
        });


        res.json({
            message:`new Lesson"${newLesson.lessonTitle}" is added to this course`,
        })

    } catch (error) {
        throw new Error(error)
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

    
    try {
        const getLesson= await Lesson.findOne({_id:id}).populate("Course")
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