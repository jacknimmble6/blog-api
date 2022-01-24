import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true
    },
    content: {
        type: String, 
        required: true
    },
    username: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },   
  comments: { type: [String], default: [], date: new Date()  },
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', PostSchema)

export default Post