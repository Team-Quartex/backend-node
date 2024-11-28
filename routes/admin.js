import express from 'express'
import {login,allUsers,userPost,sellerProducts,allsellers,verificationRequest} from '../controllers/admin.js'
import {approve,decline} from '../controllers/verification.js'

const router = express.Router();

router.post("/login",login)
router.get("/users",allUsers)
router.get("/userpost",userPost)
router.get("/sellers",allsellers)
router.get("/sellerproduct",sellerProducts)
router.get("/payment")
router.get("/verification",verificationRequest)


router.put("/request/approve",approve)
router.put("/request/decline",decline)




export default router