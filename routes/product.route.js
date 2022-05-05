const express=require('express');
const router=express.Router();
const Product=require('../models/Product');
const auth=require('../middleware/auth');
const adminAuth=require('../middleware/adminAuth');
const formidable=require('formidable');
const fs = require('fs'); 


router.post('/', auth, adminAuth, (req, res) => { //post api/product
    let form = new formidable.IncomingForm(); //create new form
    form.keepExtensions = true; //keep file extension

    form.parse(req, async (err, fields, files) => { //parse function to get data from form
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded',
            });
        }

        if (!files.photo) { //if photo is not exist
            return res.status(400).json({
                error: 'Image is required',
            });
        }

        if ( //check if file is not image
            files.photo.type !== 'image/jpeg' &&
            files.photo.type !== 'image/jpg' &&
            files.photo.type !== 'image/png'
        ) {
            return res.status(400).json({
                error: 'Image type not allowed',
            });
        }

        // check if file size is more than 1mb
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;
        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({
                error: 'All fields are required',
            });
        }

        let product = new Product(fields);
        
        if (files.photo.size > 1000000) {
            return res.status(400).json({
                error: 'Image should be less than 1MB in size',
            });
        }

        product.photo.data = fs.readFileSync(files.photo.path); //fs.readFileSync(path)
        product.photo.contentType = files.photo.type;

        try {
            await product.save(); //save product
            res.json('Product Created Successfully'); //response to client
        } catch (error) {
            console.log(error);
            res.status(500).send('Server error');
        }
    });
});

module.exports=router;