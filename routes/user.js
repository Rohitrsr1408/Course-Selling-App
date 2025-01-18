const { Router } = require('express');
const { userModel } = require('../db');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRouter = Router();
const {UserJwt}=require('../config');
 // Consider moving this to an environment variable for better security.
  
userRouter.use(express.json());

// Signup Route
userRouter.post('/signup', async function (req, res) {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Hash the password with a recommended salt round of 10
        const hashPassword = await bcrypt.hash(password, 10);
        await userModel.create({
            email: email,
            password: hashPassword,
            firstName: firstName,
            lastName: lastName,
        });
        res.json({ message: "User is registered" });
    } catch (e) {
        if (e.code === 11000) {
            // Handle duplicate key error for email
            res.json({ message: "User already exists" });
        } else {
            console.error(e); // Log unexpected errors for debugging
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

// Signin Route
userRouter.post('/signin', async function (req, res) {
    const { email, password } = req.body;

    try {
        const response = await userModel.findOne({ email: email });
        if (!response) {
            return res.status(403).json({ message: "User does not exist in our db" });
        }

        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, response.password);
        if (passwordMatch) {
            const Token = jwt.sign({ id: response._id.toString() }, UserJwt);
            res.json({ token: Token });
        } else {
            res.status(403).json({ message: "Incorrect Credentials" });
        }
    } catch (e) {
        console.error(e); // Log unexpected errors for debugging
        res.status(500).json({ message: "Internal server error" });
    }
});

// Placeholder for GET `/purchases` route
userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
});

module.exports = {
    userRouter: userRouter,
};
