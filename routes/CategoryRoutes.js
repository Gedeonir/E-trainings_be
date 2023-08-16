const express = require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCategory, getAllCategories, getOneCategory, updateCategory } = require("../controller/CategoryCtrl");

const router = express.Router();

router.post("/addCategory",authMiddleware,isAdmin,createCategory);
router.get("/allCategories",authMiddleware,getAllCategories);
router.get("/:id",authMiddleware,getOneCategory);
router.put("/:id",authMiddleware,isAdmin,updateCategory);
router.delete("/:id",authMiddleware,isAdmin);

module.exports=router