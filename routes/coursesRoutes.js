const express = require("express");

const { authMiddleware, isAdmin, authMiddlewareAdmin } = require("../middlewares/authMiddleware");
const { addLesson, getCourseAllLessons, getOneLesson, updateLesson, deleteLesson } = require("../controller/LessonCtrl");
const { getAllCourses, addNewCourse,getOneCourse, filterByPopularity } = require("../controller/CourseCtrl");
const {addQuizz,getCourseQuizzes, addQuizzQuestions, getQuizzQuestion, markTheQuizz, getOneQuiz}=require("../controller/QuizzesCtrl")
const router = express.Router();

router.get("/all-courses",getAllCourses);
router.post("/addNewCourse",authMiddlewareAdmin,addNewCourse)
router.get("/:id",getOneCourse);
router.post("/:course/addLesson",authMiddlewareAdmin,addLesson);
router.get("/:course/lessons",getCourseAllLessons);
router.get("/:course/lessons/:id",getOneLesson);
router.patch("/lesson/:id",authMiddlewareAdmin,updateLesson);
router.delete("/lesson/:id",authMiddlewareAdmin,deleteLesson);
router.get("/popular/courses",filterByPopularity)

router.post("/:course/quizz/add",authMiddlewareAdmin,addQuizz);
router.get("/:course/all-quizzes",getCourseQuizzes)
router.post("/:quizz/add/question",authMiddlewareAdmin,addQuizzQuestions)
router.get("/:quizz/view/questions",getQuizzQuestion)
router.patch('/:quizz/marking',authMiddleware,markTheQuizz);
router.get("/:course/one/quizz/:quizz",getOneQuiz);

module.exports=router