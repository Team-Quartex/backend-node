import express from 'express'
import {getPosts , addPost ,userPost} from '../controllers/post.js'

const router = express.Router();

router.get("/getall",getPosts)
// GET - http://localhost:8000/api/posts/getall need cookiee

router.post("/addPost",addPost)
// POST - http://localhost:8000/api/products/addPost body- {"desc":"ha2232sfdsfdsdsdsf3hnsaka","location":"123fddffdsdfdsfdsfghjgfdsffdfdsfds456","images":["hansaka@gmfsdsfail.com","dshdsfdsfsh"]}

router.get("/userpost",userPost)
export default router