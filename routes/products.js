import express from 'express'
import {addproduct,getallproducts,getsellerproducts,getSingleProduct} from '../controllers/product.js'
import {allCategory} from '../controllers/productCategory.js'
import {addfavourite , removeFavourite} from '../controllers/favouriteproducts.js'

const router = express.Router();

router.post("/add",addproduct)
router.get("/viewall",getallproducts)
//  viwe specific product  view?id=?
router.get("/view",getSingleProduct)
router.get("/viewseller",getsellerproducts)
router.delete("/delete",)
router.put("/edit",)
router.get("/category",allCategory)
router.post("/addfavourite",addfavourite)
router.delete("/removeFavourite",removeFavourite)



export default router