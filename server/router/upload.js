import express from "express"
import fs from "fs"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import Image from "../models/Image.js"

const router=express.Router();

// To get the correct directory path for uploads
const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename)

// Ensure 'uploads' directory exists
const uploadDir=path.join(__dirname,"../uploads")
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir)
}

// Multer Storage Setup
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null, uploadDir)
  },
  filename:function (req,file,cb) {
    const ext=path.extname(file.originalname);
    const uniqueName=`${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null,uniqueName)
  }
})

const upload=multer({storage})

// Image Upload Route
router.post("/",upload.single("image"),(req,res)=>{
  const folderId=req.body.folderId
  if(!req.file){
    return res.status(400).json({ message: "No file uploaded" })
  }

  const imageUrl=`/uploads/${req.file.filename}`

  // Optionally, save the image information in the database (MongoDB)
  const newImage = new Image({
    folderId,
    imageUrl,
      originalName: req.file.originalname, 
  })

  newImage.save()
    .then(()=>{
      console.log("Folder ID:",folderId)
      console.log("Uploaded Image URL:",imageUrl)
      res.json({message: "Image uploaded successfully",imageUrl })
    })
    .catch((err)=>{
      console.error("Error saving image:",err)
      res.status(500).json({ message: "Error saving image"})
    })
})

// Image Deletion Route
router.delete("/",async(req,res)=>{
  const{folderId,imageUrl}=req.body

  if(!folderId||!imageUrl){
    return res.status(400).json({ message: 'FolderId and ImageUrl are required' })
  }

  try {
    // Logic to delete the image file from server storage
    const imagePath=path.join(__dirname, '..','uploads',imageUrl.replace('/uploads/',''))

    // Ensure the image file exists before attempting to delete
    if (fs.existsSync(imagePath)){
      fs.unlinkSync(imagePath)// Delete the image file from the file system
    }
     else {
      return res.status(404).json({message:'Image file not found'})
    }

    // Optionally, remove the image URL from the database (MongoDB)
    await Image.findOneAndDelete({folderId,imageUrl })

    return res.status(200).json({ message:'Image deleted successfully'})
  }
  
  catch(error){
    console.error('Error deleting image:',error)
    return res.status(500).json({ message:'Error deleting image'})
  }
});

export default router
