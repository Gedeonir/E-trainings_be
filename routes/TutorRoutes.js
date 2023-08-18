const express = require("express");

const { authMiddleware, isAdmin, authMiddlewareAdmin } = require("../middlewares/authMiddleware");
const { addNewTutor, getAllTutors, getOneTutor, updateTutor, deleteTutor } = require("../controller/TutorCtrl");

const router = express.Router();

router.post("/addTutor",authMiddlewareAdmin,isAdmin,addNewTutor);
router.get("/allTutors",getAllTutors);
router.get("/:id",getOneTutor);
router.put("/:id",authMiddlewareAdmin,isAdmin,updateTutor);
router.delete("/:id",authMiddlewareAdmin,isAdmin,deleteTutor);

module.exports=router