import express from 'express'
import {starCount , getReviews} from '../controllers/review.js'

const router = express.Router();

router.post("/add",starCount)
router.get("/star",starCount)
router.get("/reviews",getReviews)

export default router