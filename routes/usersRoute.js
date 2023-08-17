const express = require("express");
const {
  createMember,
  loginMemberCtrl,
  getAllMembers,
  forgotPassword,
  resetPassword,
  changePassword,
  getOneMember,
  updatedMember,
  deleteMember,
  disableMember,
  unblockMember,
  enrollToCourse,
  viewProfile
} = require("../controller/MemberCtrl");

const {
  loginAdmin,
  updatedProfile,
  forgotPasswordAdmin,
  changePasswordAdmin,
  resetPasswordAdmin
} = require("../controller/AdminCtrl");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const memberRoutes = express.Router();
const adminRoutes=express.Router();

memberRoutes.post("/register", createMember);
memberRoutes.post("/login", loginMemberCtrl);
memberRoutes.get("/all-members", getAllMembers);
memberRoutes.patch("/forgot-password", forgotPassword);
memberRoutes.patch("/reset-password/:OTPCode", resetPassword);
memberRoutes.patch("/password", authMiddleware, changePassword);
memberRoutes.get("/:id",authMiddleware,getOneMember);
memberRoutes.delete("/:id",deleteMember)
memberRoutes.patch("/:id",authMiddleware,updatedMember)
memberRoutes.patch("/block-member/:id", authMiddleware, isAdmin, disableMember);
memberRoutes.patch("/unblock-member/:id", authMiddleware, isAdmin, unblockMember);
memberRoutes.patch("/enroll/:course", authMiddleware, enrollToCourse);
memberRoutes.get("/my/profile",authMiddleware,viewProfile)


adminRoutes.post("/login", loginAdmin);
adminRoutes.patch("/forgot-password", forgotPasswordAdmin);
adminRoutes.patch("/reset-password/:OTPCode", resetPasswordAdmin);
adminRoutes.patch("/password", authMiddleware, changePasswordAdmin);
adminRoutes.patch("/:id", authMiddleware, updatedProfile);

module.exports = {memberRoutes,adminRoutes};
