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
  enrollToCourse
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
memberRoutes.get("/:id",getOneMember);
memberRoutes.delete("/:id",authMiddleware,isAdmin,deleteMember)
memberRoutes.patch("/:id",authMiddleware,updatedMember)
memberRoutes.patch("/block-Member/:id", authMiddleware, isAdmin, disableMember);
memberRoutes.patch("/unblock-Member/:id", authMiddleware, isAdmin, unblockMember);
memberRoutes.patch("/enroll/:course", authMiddleware, enrollToCourse);


adminRoutes.post("/login", loginAdmin);
adminRoutes.patch("/forgot-password", forgotPasswordAdmin);
adminRoutes.patch("/reset-password/:OTPCode", resetPasswordAdmin);
adminRoutes.patch("/password", authMiddleware, changePasswordAdmin);
adminRoutes.patch("/:id", authMiddleware, updatedProfile);

module.exports = {memberRoutes,adminRoutes};
