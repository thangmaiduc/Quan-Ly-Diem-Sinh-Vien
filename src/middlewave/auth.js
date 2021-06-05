const jwt = require('jsonwebtoken');
const User= require('../model/users')

const authUser = async (req, res, next)=>{
    try {
        const token = req.header('authToken');
        if(!token) return res.status(400).json('Access Denied')
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user =await User.findOne({where :{id:decode.id}});
        if(!user) throw new Error();
        req.user = user;
        req.role = decode.role;
        next()
    } catch (error) {
        console.log(error);
        res.send(error)
    }
    
}
function authRole(role){
    return (req, res, next) =>{
        
        if(req.user.role !== role)
        {
            res.status(401);
            return res.send('not allowed');
        }
        next()  
    }    
    
  }


module.exports = {
    authUser,
    authRole
}