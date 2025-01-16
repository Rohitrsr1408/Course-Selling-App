const {Router}=require('express');
const courseRouter=Router();

courseRouter.get("/preview",function(req,res){
    res.json({
        message:"okay good"
    })
})

courseRouter.post('/purchase',function(req,res){
    
})

module.exports={
    courseRouter:courseRouter
}