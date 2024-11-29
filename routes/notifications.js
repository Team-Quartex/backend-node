import express from 'express'
import {getnotifications,setviewNotification,viewSellerNofification,sellerSetviewNotification} from '../controllers/notifications.js'

const router = express.Router();

router.get("/",getnotifications)
router.post("/viewnotification",setviewNotification)
router.get("/seller",viewSellerNofification)
router.post("/setviewseller",sellerSetviewNotification)




export default router