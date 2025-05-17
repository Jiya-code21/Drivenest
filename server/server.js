import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import {fileURLToPath} from 'url'
import connectDB from './utils/db.js'
import authRoute from './router/auth_router.js'
import folderRouter from './router/folder_router.js'
import uploadRoute from './router/upload.js'
import imageRoute from './router/image_router.js'

dotenv.config()
const app=express()

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

// CORS config for frontend at localhost:5173
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname,"uploads")))

connectDB()

// Routes
app.use("/api/auth",authRoute)
app.use("/api/folders",folderRouter)
app.use("/api/upload",uploadRoute)
app.use("/api/images",imageRoute)


const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
  console.log(`Server is running at port:${PORT}`)
})
