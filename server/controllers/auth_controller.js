import User from "../models/user_model.js"
import bcrypt from "bcryptjs"

//for home
const home=async(req,res,next)=>{
    try{
        res.status(200).json({msg:"Welcome to home page"})
    }
    catch(error){
next(error)
    }
}

//Register
const register=async(req,res,next)=>{
    try{
const{username,email,password}=req.body

const userExists=await User.findOne({email:email})

if(userExists){
    return res.status(400).json({message:"email already exists"})
}

//hash the password
//salting
const saltRound=10;
const hash_password=await bcrypt.hash(password,saltRound)


const userCreated=await User.create({username,email,password:hash_password})

      res.status(201).json({ msg:"registration successful",
        token:await userCreated.generateToken(),
        userId:userCreated._id.toString(),
      })

    }

    catch(error){
       // res.status(500).send({msg:"internal server error"})
       next(error)
    }
}

//Login
const login=async(req,res)=>{
    try{
const {email,password}=req.body
const userExists=await User.findOne({email})

if(!userExists){
    return res.status(400).json({message:"Invalid Credentials"})
}

//compare password
const user=await bcrypt.compare(password,userExists.password)

if(user){
  res.status(200).json({ msg:"Login successful",
        token:await userExists.generateToken(),
        userId:userExists._id.toString(),
      })
}
else
{
    res.status(401).json({message:"Invalid email or password"})
}
    }
    catch(error){
        //res.status(500).json("internal server error")
        next(error)
    }
}

//to send user data-user logic
const user=async(req,res)=>{
    try{
       const userData=req.user
console.log(userData)

return res.status(200).json({msg:userData})
    }catch(error){
        console.log(`error from the user route ${error}`)
    }
}

export {home,register,login,user}

//In most cases,converting _id to string is a good practice because it ensures consistency and compatibility across differentt JWT libraries and systems.It also aligns with the expectations that claims in a JWT are represented as strings.