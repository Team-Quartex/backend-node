import express from 'express'
import {login,allUsers,userPost,sellerProducts,allsellers,verificationRequest,paymentTable, logOut} from '../controllers/admin.js'
import {approve,decline} from '../controllers/verification.js'
import {productapprove,productdecline} from '../controllers/product.js'

const router = express.Router();

router.post("/login",login)
router.get("/logout",logOut)

router.get("/users",allUsers)
router.get("/userpost",userPost)
router.get("/sellers",allsellers)
router.get("/sellerproduct",sellerProducts)
router.get("/payment",paymentTable)
router.get("/verification",verificationRequest)


router.put("/request/approve",approve)
router.put("/request/decline",decline)


router.put("/product/approve",productapprove)
router.put("/product/decline",productdecline)

export default router