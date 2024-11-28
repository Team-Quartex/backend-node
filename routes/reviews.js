import express from 'express'
import {starCount , getReviews,addreview } from '../controllers/review.js'

const router = express.Router();

router.post("/add",addreview )
router.get("/star",starCount)
router.get("/reviews",getReviews)

export default router