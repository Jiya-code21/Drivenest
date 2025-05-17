import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose"; 

const URI=process.env.MONGO_URI;

const connectDB=async()=>{
    try{
        if(!URI){
            console.log("Mongo URI is not defined")
            process.exit(1)
        }
        await mongoose.connect(URI)
        console.log("Connection successful to DB")

    } 
    catch (error) {
        console.log("Database connection failed:",error.message)
        process.exit(0)
    }
}

export default connectDB;
