import mongoose from "mongoose"

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Folder=mongoose.model("Folder",folderSchema)

export default Folder
