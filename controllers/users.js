import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../models/user.js'
import Post from '../models/post.js'
import jwt from 'jsonwebtoken'

const secret = '4e65j';

export const registerUser = async (req, res) => {
    const { email, username, password, firstName, lastName } = req.body
  
    try {
      const oldUser = await User.findOne({ username });
  
      if (oldUser) return res.status(400).json({ message: "User already exists" })
  
      const salt = await bcrypt.genSalt(10)
  
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const result = await User.create({ email, password: hashedPassword, username, firstName, lastName })
  
      const token = jwt.sign({ username: result.username, id: result._id }, secret, { expiresIn: "1h" })
  
      res.status(201).json({ result, token })
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" })
      
      console.log(error);
    }
  }
  
  export const loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const oldUser = await User.findOne({ username })
  
      if (!oldUser) return res.status(404).json({ message: "User doesn't exist" })
  
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)
  
      if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" })
  
      const token = jwt.sign({ username: oldUser.username, id: oldUser._id }, secret, { expiresIn: "1h" })
  
      res.status(200).json({ result: oldUser, token })
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" })
    }
  }

export const findUser = async (req, res) => {
  const { id } = req.params
  
  try {
    const user = await User.findById(id)
      
     res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params
  const { username, password, email, firstName, lastName} = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No expense with id: ${id}`)

  const updatedUser = { username, password, email, firstName, lastName, _id: id } 

  await User.findByIdAndUpdate(id, updatedUser, { new: true })

  res.json(updatedUser)
}

export const getUserPosts = async (req, res) => {
  const { id } = req.params

  try {
    const posts = await Post.aggregate(
      [
        {
          $match: {
            username: id
          }
        }
      ]
    )
    
    res.status(200).json(posts)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
} 

export const deleteUserById = async (req, res) => {
  const { id } = req.params

  await User.findByIdAndRemove(id)

  res.json({ message: 'User deleted successfully.' })
}