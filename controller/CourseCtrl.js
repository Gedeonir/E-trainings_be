const Courses = require("../models/coursesModel")
const Tutor=require("../models/tutorModel")
const Category=require("../models/categoryModel")
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");


const addNewCourse=asyncHandler(async(req,res)=>{
    const{
        courseTitle,
        overview,
        courseIconImage,
        courseTutors,
        courseCategory
    }=req.body

    validateMongoDbId(courseCategory);

    validateMongoDbId(courseTutors)


    if(!courseCategory || !courseTitle || !overview ||!courseTutors) throw new Error("All title,category,oveview and lecture are required")
    if(!await Tutor.findOne({_id:courseTutors})) throw new Error("Lecture don't exists")

    const findCategory=await Category.findOne({_id:courseCategory});
    if(!findCategory) throw new Error("Category don't exists")

    const findCourse=await Courses.findOne({courseTitle:courseTitle});
    if(!findCourse){

        const newCourse=await Courses.create({
            courseTitle,
            overview,
            courseIconImage,
            courseTutors,
            courseCategory
        })

        res.json({
            message:"Course registered",
            newCourse
          });

    }else{
        throw new Error("Course Already Exists");

    }
})





const getAllCourses = asyncHandler(async (req, res) => {
    try {
      const getCourses = await Courses.find().populate("courseCategory").populate("courseTutors");
      res.json(getCourses);
    } catch (error) {
      throw new Error(error);
    }
});

const getOneCourse=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);

    
    try {
        const getCourse= await Courses.findOne({_id:id}).populate("courseCategory").populate("courseTutors")
        res.json({
            getCourse
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



module.exports={
    getAllCourses,
    addNewCourse,
    getOneCourse
    
}