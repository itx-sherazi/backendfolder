/* Create Router start */
import express from "express";
const productRoute = express.Router();
/* Create Router end */

/* import controllers start*/
import * as items from "../controllers/products.js";
/* import controllers end */

productRoute.route("/:page/:perPage").get(items.fetchProducts);
productRoute.route("/:id").get(items.fetchProduct)
productRoute.route("/creat").post(items.addProduct)
productRoute.route("/update/:id").put(items.updateProduct)
productRoute.route("/delete/:id").delete(items.deleteProduct); 
                         
                                    


export default productRoute;