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
require('.env').config();
async function main(){
    await mongoose.connect("process.env.MONGO_URL");
    app.listen(3000);
    console.log("listening on port 3000");
}

main();
