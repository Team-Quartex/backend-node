import express from 'express'
import {addproduct,getallproducts,getsellerproducts} from '../controllers/product.js'

const router = express.Router();

router.post("/add",addproduct)
router.get("/viewall",getallproducts)
// api/
router.get("/viewseller",getsellerproducts)
router.delete("/delete",)
router.put("/edit",)



export default router