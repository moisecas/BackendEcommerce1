const express = require('express');//import express
const router = express.Router();//import router
const jwt = require('jsonwebtoken');//import jwt, generate token
const bcrypt = require('bcryptjs');//import bcrypt, encrypt password

//validation
const { check,validationResult } = require('express-validator');
const gravatar = require('gravatar');//import gravatar email to avatar
const auth = require('../middleware/auth');//import auth middleware


//import models
const User = require('../models/user');


router.get('/', auth, async (req, res) => {
    try {
        //get all users
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fail Error');
    }
})


//route post api/users

router.post('/register',[
    check({name:'name'}).not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Email is required'),
    check('password please').isLength({min:6}).withMessage('Password must be at least 6 characters'),
], async (req,res)=>{ //async function to handle async await
    const errors = validationResult(req); //    check validation
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()}); //if error return 400
    }
    const {name,email,password} = req.body; //get data from req.body
    try{
        let user = await User.findOne({email}); //check if email is already exist
        if(user){ //if user is exist
            return res.status(400).json({msg:'User already exists'}); //if user already exists return 400
        }
        const avatar = gravatar.url(email,{ //get gravatar email to avatar
            s:'200',
            r:'pg',
            d:'mm'
        });
        user = new User({ //create new user
            name,
            email,
            avatar,
            password
        });
        const salt = await bcrypt.genSalt(10); //salt password so it is more secure
        user.password = await bcrypt.hash(password,salt); //encrypt password
        await user.save();
        const payload = {
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,process.env.JWT_SECRET,{ //generate token
            expiresIn:360000 //expires in 1 hour
        },(err,token)=>{ //if error return 500
            if(err) throw err;
            res.json({token});
        });
    }catch(err){ //
        console.error(err.message);
        res.status(500).send('Server Error');//view error 500
    }
});

router.post('/login',[check('email', 'email correcto x favor').isEmail(),
check('password', "password is required").exists()] ,async (req,res)=>{
    const {email,password} = req.body; //get data from req.body
    try{ 
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:'User not found'});//if user not found return 400
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:'Invalid credentials'});
        }
        const payload = {
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,process.env.JWT_SECRET,{ 
            expiresIn:360000
        },(err,token)=>{
            if(err) throw err;
            res.json({token});
        });
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; //export router to server.js