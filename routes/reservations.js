import express from 'express'
import { checkReservation,addReservation } from '../controllers/reservation.js'

const router = express.Router()

router.get("/check",checkReservation)
router.post("/addreservation",addReservation)


export default router