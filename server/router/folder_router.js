import express from "express"
import Folder from "../models/folder.js"
import authMiddleware from "../middleware/auth_middleware.js"

const router=express.Router()

// CREATE folder
router.post("/create",authMiddleware,async (req,res)=>{
  const {name,parentId=null }=req.body
  try {
    const folder=await Folder.create({ name,parentId,userId:req.user._id })
    res.status(201).json({ message: "Folder created", folder })
  } 
  catch(err){
    res.status(500).json({ message: "Error creating folder",err})
  }
})

// READ folders
router.get("/",authMiddleware,async(req,res)=>{
  try {
    const folders=await Folder.find({userId:req.user._id})
    res.status(200).json({ folders })
  } 
  catch (err){
    res.status(500).json({ message:"Error fetching folders",err})
  }
})

// UPDATE folder
router.put("/:id",authMiddleware,async(req,res)=>{
  const{name}=req.body;
  try {
    const updated = await Folder.findOneAndUpdate(
      { _id: req.params.id,
        userId: req.user._id },
      {name},
      {new:true}
    )
    res.json({ message: "Folder renamed", updated })
  } 
  catch (err) {
    res.status(500).json({ message: "Error renaming folder", err })
  }
});

// DELETE folder
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Optional: delete subfolders too
    await Folder.deleteMany({
      $or: [
        { _id: req.params.id, userId: req.user._id },
        { parentId: req.params.id, userId: req.user._id }
      ]
    })
    res.json({ message: "Folder deleted" })
  } 
  catch (err) {
    res.status(500).json({message:"Error deleting folder",err})
  }
});

export default router
