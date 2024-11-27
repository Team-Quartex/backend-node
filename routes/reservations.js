import express from 'express'
import { checkReservation,addReservation,getSellerDateReservation ,UserReservationsList} from '../controllers/reservation.js'

const router = express.Router()

router.get("/check",checkReservation)
router.post("/addreservation",addReservation)
router.get("/sellerdate",getSellerDateReservation)
router.get("/userreservation",UserReservationsList)


export default router