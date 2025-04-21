import express from "express"
import { userRoutes } from "./userRoutes.js";
import { adminRoutes } from "./adminRoutes.js";
import { carRoutes } from "./carRoutes.js";
import { cartRoutes } from "./cartRoutes.js";
import { reviewRoutes } from "./reviewRoutes.js";
import { bookingRoutes } from "./bookingRoutes.js";
import { paymentRouter } from "./paymentRoutes.js";
import { authRoutes } from "./auth.js";


const router = express.Router();

router.use("/user",userRoutes)

router.use("/admin",adminRoutes)

router.use("/car",carRoutes)

router.use("/cart",cartRoutes)

router.use("/booking",bookingRoutes)

router.use("/review",reviewRoutes)

router.use("/payment",paymentRouter)

router.use("/auth",authRoutes)



export {router as apiRouter}