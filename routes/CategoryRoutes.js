const express = require("express");

const { authMiddleware, isAdmin, authMiddlewareAdmin } = require("../middlewares/authMiddleware");
const { createCategory, getAllCategories, getOneCategory, updateCategory, deleteCategory } = require("../controller/CategoryCtrl");

const router = express.Router();

router.post("/addCategory",authMiddlewareAdmin,isAdmin,createCategory);
router.get("/allCategories",authMiddlewareAdmin,isAdmin,getAllCategories);
router.get("/:id",authMiddleware,getOneCategory);
router.put("/:id",authMiddlewareAdmin,isAdmin,updateCategory);
router.delete("/:id",authMiddlewareAdmin,isAdmin,deleteCategory);

module.exports=router