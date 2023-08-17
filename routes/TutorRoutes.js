const express = require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { addNewTutor, getAllTutors, getOneTutor, updateTutor, deleteTutor } = require("../controller/TutorCtrl");

const router = express.Router();

router.post("/addTutor",authMiddleware,isAdmin,addNewTutor);
router.get("/allTutors",getAllTutors);
router.get("/:id",getOneTutor);
router.put("/:id",authMiddleware,isAdmin,updateTutor);
router.delete("/:id",authMiddleware,isAdmin,deleteTutor);

module.exports=router