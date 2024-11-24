import express from 'express'
import {getnotifications,setviewNotification} from '../controllers/notifications.js'

const router = express.Router();

router.get("/",getnotifications)
router.post("/viewnotification",setviewNotification)




export default router