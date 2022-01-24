import express from "express"
import { loginUser, registerUser, findUser, 
updateUser, getUserPosts, deleteUserById } from '../controllers/users.js'
import { getPosts, createPost, getRandomPost, createComment,
getPostById, updatePost, deletePostById, getPostsByCategory } from '../controllers/posts.js'

const router = express.Router()

router.post('/user/register', registerUser)
router.post('/user/login', loginUser)
router.get('/user/fetch/:id', findUser)
router.patch('/user/update/:id', updateUser)
router.get('/user/posts/:id', getUserPosts)
router.delete('/user/:id', deleteUserById)

router.post('/post/add', createPost)
router.get('/posts', getPosts)
router.get('/posts/category', getPostsByCategory)
router.patch('/posts/update/:id', updatePost)
router.get('/posts/random', getRandomPost)
router.get('/posts/:id', getPostById)
router.delete('/posts/:id', deletePostById)
router.post('/posts/:id/commentPost', createComment)

export default router