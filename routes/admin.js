const {Router}=require("express");
const express=require('express');
const adminRouter=Router();
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const {adminModel, courseModel}=require("../db");
const {Admin_jwt}=require('../config');
const {adminMiddleware}=require('../middlewares/admin');

adminRouter.use(express.json());
adminRouter.post('/signup',async function(req,res){
    const {email,password,firstName,lastName}=req.body;
    const hashPassword = await bcrypt.hash(password, 5);
    let errorthrown=false;
    try{
        await adminModel.create({
            email:email,
            password:hashPassword,
            firstName:firstName,
            lastName:lastName
        })
    }
    catch(e){
        res.json({
            message:"Admin already exists"
        })
     errorthrown=true;
     console.log(e);
    }
    if(!errorthrown){
        res.json("Admin is registered");
    }
})

adminRouter.post('/signin',async function(req,res){
    const {email,password}=req.body;
    const response =await adminModel.findOne({
        email:email
    })
    if(!response){
        res.status(403).json({
            message:"User does not exist in our db"
        })
        return
    }
    const passwordMatch=await bcrypt.compare(password,response.password);
    if(passwordMatch){
        const Token=jwt.sign({
            id:response._id.toString()
        } ,Admin_jwt);
        res.json({
            token:Token
        })
    }
    else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }
})

adminRouter.post('/course',adminMiddleware,async function(req,res){
    const adminId=req.userId;
    const {title,description,imageUrl,price}=req.body;

    const course= await courseModel.create({
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price,
        creatorId:adminId
    })
    res.json({
        message:"Course is created",
        courseId:course._id
    })
})

adminRouter.put('/course', adminMiddleware, async function (req, res) {
    try {
        const adminId = req.userId; // Assuming this is set by adminMiddleware
        const { title, description, imageUrl, price, courseId } = req.body;
         console.log(adminId);
        // Validate required fields
        if (!courseId || !title || !description || !imageUrl || !price) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Update the course
        const course = await courseModel.findOneAndUpdate(
            { _id: courseId },
            { title, description, imageUrl, price },
            { new: true } // Returns the updated document
        );
         console.log(course);
        if (!course) {
            return res.status(404).json({ message: "Course not found or unauthorized." });
        }

        res.status(200).json({
            message: "Course updated successfully.",
            courseId: course._id
        });
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
adminRouter.get('/course/bulk',adminMiddleware,async function(req,res){
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
})

module.exports={
    adminRouter:adminRouter
}
