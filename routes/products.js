import express from 'express'
import {addproduct,getallproducts,getsellerproducts} from '../controllers/product.js'
import {allCategory} from '../controllers/productCategory.js'
import {addfavourite , removeFavourite} from '../controllers/favouriteproducts.js'

const router = express.Router();

router.post("/add",addproduct)
router.get("/viewall",getallproducts)
// api/
router.get("/viewseller",getsellerproducts)
router.delete("/delete",)
router.put("/edit",)
router.get("/category",allCategory)
router.post("/addfavourite",addfavourite)
router.delete("/removeFavourite",removeFavourite)



export default router