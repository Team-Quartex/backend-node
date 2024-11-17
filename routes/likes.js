import express from 'express'
import {getLikes, addLike ,deleteLike} from '../controllers/like.js'

const router = express.Router();

router.get("/",getLikes)
// GET http://localhost:8000/api/likes?postId=1

router.post("/",addLike)
// POST http://localhost:8000/api/likes body - {"postId":1}

router.delete("/",deleteLike)
// DELETE http://localhost:8000/api/likes



export default router