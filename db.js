const {mongoose}=require('mongoose');
console.log("connected");

const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const UserSchema=new Schema({
    email:{type:String,unique:true},
    password:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true}
});

const adminSchema=new Schema({
    email:{type:String,unique:true},
    password:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true}
})

const courseSchema=new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId
})

const purchaseSchema=new Schema({
    userId:ObjectId,
    courseId:ObjectId
})

const userModel=mongoose.model("users",UserSchema);
const adminModel=mongoose.model("admins",adminSchema);
const courseModel=mongoose.model("courses",courseSchema);
const purchaseModel=mongoose.model("purchases",purchaseSchema);


module.exports={
   userModel,
   adminModel,
   courseModel,
   purchaseModel
}

