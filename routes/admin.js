import express from 'express'
import {login,allUsers,userPost,sellerProducts,allsellers,verificationRequest} from '../controllers/admin.js'

const router = express.Router();

router.post("/login",login)
router.get("/users",allUsers)
router.get("/userpost",userPost)
router.get("/sellers",allsellers)
router.get("/sellerproduct",sellerProducts)
router.get("/payment")
router.get("/verification",verificationRequest)




export default router