import jwt from "jsonwebtoken"
import User from "../models/user_model.js"
const authmiddleware=async(req,res,next)=>{
const token=req.header('Authorization')
if(!token){
    return res.status(401).json({message:"Unauthorized HTTP,Token not provided"})
}


const jwttoken=token.replace("Bearer","").trim()
console.log('token from auth middleware',jwttoken)
try{
    const isVerified=jwt.verify(jwttoken,process.env.JWT_SECRET_KEY)
    const userData=await User.findOne({email:isVerified.email}).
    select({
        password:0,
    })
        console.log(userData)
        req.user=userData
        req.token=token
        req.userID=userData._id
next()
}
catch(error){
   return res.status(401).json({message:"Unauthorized. Invalid token."}) 
}

}
export default authmiddleware