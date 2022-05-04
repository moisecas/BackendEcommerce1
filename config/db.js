const mongoose = require('mongoose');
const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URL, { //connect to mongoDB
      
    }) 
    console.log(`MongoDB Connected: ${connection.connection.host}` ) //if connected to mongoDB, print host
    };
    module.exports = connectDB; //export connectDB function 

