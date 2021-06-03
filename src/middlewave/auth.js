

const authUser = (req, res, next)=>{
    if(!req.user)
    {
            res.status(404);
           return res.send('please login account')
    }
   
    next()
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