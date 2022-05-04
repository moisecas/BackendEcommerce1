const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const app = express(); 
require('dotenv').config({
    path: './config/index.env', 
}); 


app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cors());

//routes of server
app.use('/api/user/', require('./routes/auth.route'));

app.get('/', (req, res) => { 
    res.send('test route home page'); // send a response to the client
});

//Page Not Found
app.use((req, res)=>{
    res.status(404).json({
        msg: 'Page Not Found'
        });
})

const PORT=process.env.PORT || 8080;

app.listen(8080, () => {
    console.log(`Server is running on port ${PORT}`);
});