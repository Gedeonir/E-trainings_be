const express = require("express");
const {
  createTrainee,
  loginTraineeCtrl,
  getAllTrainees,
  forgotPassword,
  resetPassword,
  changePassword,
  getOneTrainee,
  updatedTrainee,
  deleteTrainee,
  disableTrainee,
  unblockTrainee,
  enrollToCourse,
  viewProfile,
  getMyEnrolledCourses,
  completeLesson,
  filterTraineeByScore
} = require("../controller/TraineeCtrl");

const {
  loginAdmin,
  updatedProfile,
  forgotPasswordAdmin,
  changePasswordAdmin,
  resetPasswordAdmin,
  viewAdminProfile
} = require("../controller/AdminCtrl");

const { authMiddleware, isAdmin, authMiddlewareAdmin } = require("../middlewares/authMiddleware");
const traineeRoutes = express.Router();
const adminRoutes=express.Router();

traineeRoutes.post("/register", createTrainee);
traineeRoutes.post("/login", loginTraineeCtrl);
traineeRoutes.get("/all-trainees", getAllTrainees);
traineeRoutes.patch("/forgot-password", forgotPassword);
traineeRoutes.patch("/reset-password/:OTPCode", resetPassword);
traineeRoutes.patch("/password", authMiddleware, changePassword);
traineeRoutes.get("/:id",getOneTrainee);
traineeRoutes.delete("/:id",deleteTrainee)
traineeRoutes.patch("/:id",authMiddleware,updatedTrainee)
traineeRoutes.patch("/block-Trainee/:id", authMiddleware, isAdmin, disableTrainee);
traineeRoutes.patch("/unblock-Trainee/:id", authMiddleware, isAdmin, unblockTrainee);
traineeRoutes.patch("/enroll/:course", authMiddleware, enrollToCourse);
traineeRoutes.patch("/complete/:lesson", authMiddleware, completeLesson);
traineeRoutes.get("/my/courses", authMiddleware, getMyEnrolledCourses);
traineeRoutes.get("/my/profile",authMiddleware,viewProfile);
traineeRoutes.get("/top/Trainee",filterTraineeByScore);


adminRoutes.post("/login", loginAdmin);
adminRoutes.patch("/forgot-password", forgotPasswordAdmin);
adminRoutes.patch("/reset-password/:OTPCode", resetPasswordAdmin);
adminRoutes.patch("/password", authMiddlewareAdmin, changePasswordAdmin);
adminRoutes.patch("/:id", authMiddlewareAdmin, updatedProfile);
adminRoutes.get("/my/profile",authMiddlewareAdmin,viewAdminProfile)

module.exports = {traineeRoutes,adminRoutes};
