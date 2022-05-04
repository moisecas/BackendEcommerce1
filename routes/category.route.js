const express = require("express");
const router= express.Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth"); 
const adminAuth = require("../middleware/adminAuth"); 

const { check, validationResult } = require("express-validator"); //validation middleware

router.post('/',[ //post api/category
    check("name", "Name is required").trim().not().isEmpty(), //check if name is empty
], auth,adminAuth, async (req, res) => {
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()[0].msg}); //if error return 400
        }
        //check validation
        const {name} = req.body; //get data from req.body
        try {
            let category = await Category.findOne({name});
            if(category){
                return res.status(400).json({msg:'Category already exists'}); //if category already exists return 400
            }
            //check if name is already exist
          const newCategory = new Category({name}); //create new category
          category = await newCategory.save(); //save category
          res.json(category); //return category  
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
            
        }
    res.send("Hi, ok");

})

router.get('/all', async(req,res)=>{ //get api/category/all
    try {
        let data = await category.find({});
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router; //export router

