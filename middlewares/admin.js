const jwt=require('jsonwebtoken');
const {Admin_jwt}=require('../config'); 
function adminMiddleware(req,res,next){
    const token=req.headers.token;
    const decodedData=jwt.verify(token,Admin_jwt);
    if(decodedData){
        req.userId=decodedData.id;
        next();
    }
    else{
        res.status(403).json({
            message:"Incorrect credentials"
        })
    }
}
module.exports={
    adminMiddleware:adminMiddleware
}