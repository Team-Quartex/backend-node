import express from 'express'
import {getsavedpost,addsavedpost,reomvesavedpost} from '../controllers/savedpost.js'


const router = express.Router();

router.get("/getsavedposts",getsavedpost)
// GET http://localhost:8000/api/likes?postId=1

router.post("/addsavedposts",addsavedpost)
// POST http://localhost:8000/api/likes body - {"postId":1}

router.delete("/removesavedpost",reomvesavedpost)
// DELETE http://localhost:8000/api/likes



export default router