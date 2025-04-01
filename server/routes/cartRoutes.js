import express from "express";
import { addCarToCart, clearCart, getCart, removeCarFromCart } from "../controllers/cartController.js";
import { userAuth } from "../middlewares/userAuth.js";


const router = express.Router();

//get cart details
router.get("/get-cart-details", userAuth, getCart)

//add to cart
router.post("/add-to-cart", userAuth, addCarToCart )

//remove from cart
router.delete("/remove-from-cart", userAuth, removeCarFromCart)

//clear cart
router.delete("/clear-cart", userAuth, clearCart  )



export { router as cartRoutes };