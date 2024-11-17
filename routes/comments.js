import express from 'express'
import {addComment, getComments} from '../controllers/comment.js'

const router = express.Router();

router.get("/",getComments)
// GET http://localhost:8000/api/comments?postId=1

router.post("/addcomment",addComment)
// POST http://localhost:8000/api/comments/addcomment body - {"postId":"1","content":"Nice picture"}



export default router