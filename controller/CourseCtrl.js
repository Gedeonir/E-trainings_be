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

    if(!courseCategory || !courseTitle || !overview ||!courseIconImage ||!courseTutors) throw new Error("All fields are required")

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


const checkTutors=async(req,res,next)=>{
    const {courseTutors}=req.body


    const Filter = async (courseTutors, predicate) => {
        const results = await Promise.all(courseTutors.map(predicate));
        return courseTutors.filter((_v, index) => results[index]);
    }

    //Check if all Tutors Exists
    const tutorNotExist=await Filter(courseTutors, async (tutor) => {

        validateMongoDbId(tutor);
        return !await Tutor.findOne({_id:tutor});
    }); 


    if(tutorNotExist.length>0)   res.json({
        message:"Tutor no longer exists",
        tutorNotExist
    });
    
    next();

}

const getAllCourses = asyncHandler(async (req, res) => {
    try {
      const getCourses = await Courses.find().populate({path:"enrolledMembers"});
      res.json(getCourses);
    } catch (error) {
      throw new Error(error);
    }
});



module.exports={
    getAllCourses,
    addNewCourse,
    checkTutors
}