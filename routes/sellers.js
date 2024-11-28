import express from 'express'
import {registerseller , loginseller , sellerlogout,sellerStatics,sellerPayment,sellerWithdraw , addwithdraw , sellerDetails ,sellerUpdate} from "../controllers/seller.js"

const router = express.Router();

router.post("/register",registerseller)
router.post("/login",loginseller)
router.get("/logout",sellerlogout)
router.get('/sellerstatus',sellerStatics)
router.get("/sellerearnings",sellerPayment)
router.get("/sellerwithdraw",sellerWithdraw)
router.post("/addwithdraw",addwithdraw)
router.get("/details",sellerDetails)
router.put("/update",sellerUpdate)

export default router