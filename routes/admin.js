import express from 'express'
import {login} from '../controllers/admin.js'

const router = express.Router();

router.post("/login",login)
router.get("/users")
router.get("/sellers")
router.get("/payment")
router.get("/verification")




export default router