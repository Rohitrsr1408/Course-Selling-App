require('dotenv').config();
const express=require('express');
const {adminRouter}=require("./routes/admin");
const app=express();
const {userRouter}=require("./routes/user");
const {courseRouter}=require("./routes/course");
const{mongoose}=require('mongoose');
app.use(express.json());
app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);
const MONGO_URL=process.env.MONGO_URL;
async function main(){
    await mongoose.connect("mongodb+srv://rohitrana8041:rsr1408@course-selling-app.40w0r.mongodb.net/test");
    app.listen(3000);
    console.log("listening on port 3000");
}

main();
