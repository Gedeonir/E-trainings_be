const Category=require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");


const createCategory=asyncHandler(async(req,res)=>{
    const{
        categoryName,
        descrption
    }=req.body

    try {
        if(!categoryName || !descrption) throw new Error("All fields are required");

        if(await Category.findOne({categoryName})) throw new Error("Category exists")

        const newCategory = await Category.create({
            categoryName,
            descrption
        });

        res.json({
            message:`new Category "${newCategory.categoryName}" is created sucessfully`,
        })

    } catch (error) {
        throw new Error(error)
    }
})

const getAllCategories=asyncHandler(async(req,res)=>{
    try {
        const getAllCategories=await Category.find()
        res.json(getAllCategories);
    } catch (error) {
        throw new Error(error)
    }
})

const getOneCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    
    try {
        const getCategory= await Category.findOne({_id:id})
        res.json({
            getCategory
        })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);

    try {
        await Category.findByIdAndDelete(id)
        res.json({
            message:"Category deleted succesfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    validateMongoDbId(id);
    
    const{
        categoryName,
        descrption
    }=req.body

    try {
        if(!categoryName || !descrption) throw new Error("All fields are required");

        if(await Category.findOne({categoryName})) throw new Error("Category exists")

        const updateCategory = await Category.findByIdAndUpdate(
            id,
            {
            categoryName,
            descrption
            },
            {
                new: true,
            }
        )

        res.json(updateCategory)
    } catch (error) {
     throw new Error(error)   
    }
})

module.exports={
    createCategory,
    getAllCategories,
    getOneCategory,
    updateCategory,
    deleteCategory
}