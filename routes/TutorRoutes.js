const express = require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { addNewTutor, getAllTutors, getOneTutor, updateTutor } = require("../controller/TutorCtrl");

const router = express.Router();

router.post("/addTutor",authMiddleware,isAdmin,addNewTutor);
router.get("/allTutors",authMiddleware,getAllTutors);
router.get("/:id",authMiddleware,getOneTutor);
router.put("/:id",authMiddleware,isAdmin,updateTutor);
router.delete("/:id",authMiddleware,isAdmin);

module.exports=router