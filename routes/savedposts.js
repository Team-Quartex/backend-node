import express from 'express'
import {getsavedpost,addsavedpost,reomvesavedpost} from '../controllers/savedpost.js'


const router = express.Router();

router.get("/",getsavedpost)
// GET http://localhost:8000/api/likes?postId=1

router.post("/",addsavedpost)
// POST http://localhost:8000/api/likes body - {"postId":1}

router.delete("/",reomvesavedpost)
// DELETE http://localhost:8000/api/likes



export default router