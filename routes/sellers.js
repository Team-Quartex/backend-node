import express from 'express'
import {registerseller , loginseller , sellerlogout} from "../controllers/seller.js"

const router = express.Router();

router.post("/register",registerseller)
router.post("/login",loginseller)
router.get("/logout",sellerlogout)



export default router