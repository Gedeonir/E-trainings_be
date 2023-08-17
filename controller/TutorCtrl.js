const Tutors=require("../models/tutorModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");


const addNewTutor=asyncHandler(async(req,res)=>{
    const{
        fullNames,
        email,
        mobile
    }=req.body

    
    if(!fullNames || !mobile ||!email) throw new Error("All fields are required");

    if(await Tutors.findOne({email:email})) throw new Error("Tutor already exists")
    else{
        const newTutor= await Tutors.create({
            fullNames,
            email,
            mobile
        });

        res.json({
            message:`New tutor "${newTutor.fullNames}" is added sucessfully`,
        })
    }

    
})

const getAllTutors=asyncHandler(async(req,res)=>{
    try {
        const getAllTutors=await Tutors.find()
        res.json(getAllTutors);
    } catch (error) {
        throw new Error(error)
    }
})

const getOneTutor=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    
    try {
        const getTutor= await Tutors.findOne({_id:id})
        res.json({
            getTutor
        })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteTutor=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);

    try {
        await Tutors.findByIdAndDelete(id)
        res.json({
            message:"Tutor deleted succesfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateTutor=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    
    const{
        fullNames,
        email,
        mobile
    }=req.body

    try {
        if(!fullNames || !mobile ||!email) throw new Error("All fields are required");

        if(await Tutors.findOne({email})) throw new Error("Tutor already exists")

        const updateTutor = await Tutors.findByIdAndUpdate(
            id,
            {
            fullNames,
            email,
            mobile
            },
            {
                new: true,
            }
        )

        res.json(updateTutor)
    } catch (error) {
     throw new Error(error)   
    }
})

module.exports={
    addNewTutor,
    getAllTutors,
    getOneTutor,
    updateTutor,
    deleteTutor
}