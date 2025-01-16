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
    const {title,description,imageurl,price}=req.body;

    const course= await courseModel.create({
        title:title,
        description:description,
        imageurl:imageurl,
        price:price,
        CreatorId:adminId
    })
    res.json({
        message:"Course is created",
        courseId:course._id
    })
})

adminRouter.put('/course',adminMiddleware,async function(req,res){
    const adminId=req.userId;
    const{courseId,title,description,imageurl,price}=req.body;
   await courseModel.updateOne({_id:courseId,CreatorId:adminId},{title:title,description:description,imageurl:imageurl,price:price})
       
    res.json({
        message:"Course is updated"
    });
});
adminRouter.get('/course/bulk',function(req,res){
    
})

module.exports={
    adminRouter:adminRouter
}
