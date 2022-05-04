const User = require('../models/user');

module.exports=async (req,res,next)=>{
    try {

        const user = await User.findOne({_id:req.user.id})
        if(user.role ===0){
            return res.status(401).json({msg:'Admin authorization denied'})
        }
        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        
    }
}
