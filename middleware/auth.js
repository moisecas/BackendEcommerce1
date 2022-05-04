const jwt = require('jsonwebtoken');
module.exports = function(req,res,next){ 
    const token = req.header('x-auth-token'); //get token from header
    if(!token){ //if token is not exist
        return res.status(401).json({msg:'No token, authorization denied'});
    }
    try{ //if token is exist
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }catch(err){ // if token is invalid
        res.status(401).json({msg:'Token is not valid'}); //return 401 client error
    }
}