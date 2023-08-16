const express = require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { addLesson, getCourseAllLessons, getOneLesson, updateLesson, deleteLesson } = require("../controller/LessonCtrl");


const router = express.Router();

router.post("/:course/addLesson",authMiddleware,isAdmin,addLesson);
router.get("/:course/lessons",authMiddleware,getCourseAllLessons);
router.get("/lesson/:id",authMiddleware,getOneLesson)
router.patch("/lesson/:id",authMiddleware,updateLesson)
router.delete("/lesson/:id",authMiddleware,deleteLesson)

module.exports=router