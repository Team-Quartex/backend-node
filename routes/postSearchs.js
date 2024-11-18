import express from 'express'
import {getSearch} from '../controllers/postsearch.js'


const router = express.Router();

router.get("/searchall",getSearch)

export default router