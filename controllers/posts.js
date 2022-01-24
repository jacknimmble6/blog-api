import Post from '../models/post.js'
import mongoose from 'mongoose'

export const createPost = async (req, res) => {
  const { title, content, category, image, username, fullName } = req.body
  
  if (username === null) {
    res.status(500).json({ message: error.message })
  }

  const newPost = await Post.create({ title, content, category, image, username, fullName }) 

  try {
    await newPost.save()

    res.status(200).json(newPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPosts = async (req, res) => {
  const { search1 } = req.query

  try {
    const title = new RegExp(search1, 'i')

    const posts = await Post.find({ $or: [ { title } ] })

    res.status(200).json(posts)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const getPostById = async (req, res) => {
  const { id } = req.params

  try {
    const post = await Post.findById(id)
    
    res.status(200).json(post)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
} 

export const getRandomPost = async (req, res) => {
  try {
    const post = await Post.aggregate([
      {
        $sample: {
          size: 1
        }
      }
    ])

    res.status(200).json(post)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const getPostsByCategory = async (req, res) => {
  const { category1 } = req.query

  try {
    const category = new RegExp(category1, 'i')
    
    const posts = await Post.find({ $or: [ { category } ] })

    res.status(200).json(posts)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params
  const { title, content, category, image, username, fullName } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`)

  const updatedPost = { title, content, category, image, username, fullName, _id: id } 

  await Post.findByIdAndUpdate(id, updatedPost, { new: true })

  res.json(updatedPost)
}

export const deletePostById = async (req, res) => {
  const { id } = req.params

  await Post.findByIdAndRemove(id)

  res.json({ message: 'Income deleted successfully.' })
}

export const createComment = async (req, res) => {
  const { id } = req.params
  const { comment } = req.body

  const post = await Post.findById(id)

  post.comments.push(comment)

  const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })

  res.json(updatedPost)
}