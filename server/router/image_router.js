import express from "express"
import Image from "../models/Image.js"
import fs from "fs"
import path from "path"
import multer from "multer";




const router=express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


router.get("/",async(req,res)=>{
  try{
    const{search}=req.query;
    let query = {}
    if (search) {
      query.originalName={$regex:search,$options:"i"}
    }

    const images=await Image.find(query)
    res.status(200).json({ images })
  }
   catch (error) {
    console.error("Error fetching images:", error)
    res.status(500).json({ message: "Server error while fetching images" })
  }
})

// DELETE image by ID (remove from DB and delete image file)
router.delete("/:id", async (req, res) => {
  try {
    const imageId=req.params.id;
    const image=await Image.findById(imageId)

    if (!image){
      return res.status(404).json({ message: "Image not found" })
    }

    // Delete image document from DB
    await Image.findByIdAndDelete(imageId)

    // Delete image file from disk (if exists)
    if (image.imageUrl){
      const filePath=path.join(process.cwd(),image.imageUrl)
      fs.unlink(filePath,(err)=>{
        if (err) {
          console.error("Error deleting image file:",err)
        }
      })
    }

    res.json({ message:"Image deleted successfully" })
  }
   catch (error) {
    console.error("Error deleting image:",error)
    res.status(500).json({ message: "Server error while deleting image" })
  }
})

// PUT update image originalName by ID (rename)
router.put("/:id", async (req, res) => {
  try{
    const {originalName}=req.body;
    const image=await Image.findById(req.params.id)

    if (!image){
      return res.status(404).json({ message: "Image not found" })
    }

    image.originalName=originalName
    await image.save()

    res.status(200).json({ message: "Image renamed successfully" })
  } 
  catch(err){
    console.error("Error renaming image:", err)
    res.status(500).json({ message: "Server error while renaming image" })
  }
})


router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const newImage = new Image({
      originalName: req.file.originalname,
      imageUrl: req.file.path,
    });

    await newImage.save();

    res.status(201).json({ message: "Image uploaded successfully", image: newImage });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error while uploading image" });
  }
})

export default router
