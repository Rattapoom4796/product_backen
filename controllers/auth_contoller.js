const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require('dotenv');
dotenv.config();
//REGISTER 

exports.register = async (req,res) =>{
    const {user_name, password,name, role} = req.body;
    try{
        const hashedPasswor = await bcrypt.hash(password, 10);
        const user = new User ({user_name, role,name,password: hashedPasswor});
        await user.save();
        res.status(201).send("User registered");
    }catch (err){
        res.status(400).send(err.message);
    }
    
};

//LOGIN 

exports.login = async (req,res) =>{
    const{user_name, password } = req.body;
    try{
        const user = await User.findOne({user_name});
        if(!user) return res.status(400).send("User not found");
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch) return res.status(400).send("Invalid credentials");

        const tmpuser = await User.findOne({user_name}).select("-password");

        const accessToken = jwt.sign(
            {userId: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"1h"}
        );
        const refreshToken = jwt.sign(
            {userId: user._id},
            process.env.REFRESH_TOKEN_SECRET
        );
        res.json({user :tmpuser,accessToken, refreshToken});

    }catch(err){
        res.status(500).send(err.message);
    }

};


exports.refresh = async (req,res) => {
    const {token}=req.body;
    
    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403);
        const accessToken = jwt.sign(
            {userID: user.userId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"1h"}
        );
        res.json({accessToken});
    })
}