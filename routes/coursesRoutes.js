const express = require("express");

const { authMiddleware, isAdmin, authMiddlewareAdmin } = require("../middlewares/authMiddleware");
const { addLesson, getCourseAllLessons, getOneLesson, updateLesson, deleteLesson } = require("../controller/LessonCtrl");
const { getAllCourses, addNewCourse,getOneCourse } = require("../controller/CourseCtrl");

const router = express.Router();

router.get("/all-courses",getAllCourses);
router.post("/addNewCourse",authMiddlewareAdmin,isAdmin,addNewCourse)
router.get("/:id",getOneCourse);
router.post("/:course/addLesson",authMiddlewareAdmin,isAdmin,addLesson);
router.get("/:course/lessons",getCourseAllLessons);
router.get("/lesson/:id",getOneLesson)
router.patch("/lesson/:id",authMiddlewareAdmin,updateLesson)
router.delete("/lesson/:id",authMiddlewareAdmin,deleteLesson)

module.exports=router