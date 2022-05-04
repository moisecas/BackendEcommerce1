const mongoose = require('mongoose');


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
        unique: true
    }
},{ timmestamps: true}); //timestamp for createdAt 

module.exports = user = mongoose.model('Category', CategorySchema); 