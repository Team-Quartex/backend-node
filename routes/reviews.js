import express from 'express'
import {starCount} from '../controllers/review.js'

const router = express.Router();

router.post("/add",starCount)
router.get("/star",starCount)

export default router