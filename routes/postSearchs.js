import express from 'express'
import {getSearch , getSearchres} from '../controllers/postsearch.js'


const router = express.Router();

router.get("/searchall",getSearch)
router.get("/searchquey",getSearchres)

export default router