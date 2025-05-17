import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Folder',
  },
    
  imageUrl: {
    type: String,
    required: true,
  },
   originalName:{
    type: String,
    required: true,
  },

},{timestamps:true})

const Image=mongoose.model('Image',imageSchema)

export default Image
