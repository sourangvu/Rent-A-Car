import express from "express"
import { userRoutes } from "./userRoutes.js";
import { adminRoutes } from "./adminRoutes.js";
import { carRoutes } from "./carRoutes.js";
import { cartRoutes } from "./cartRoutes.js";
import { reviewRoutes } from "./reviewRoutes.js";


const router = express.Router();

router.use("/user",userRoutes)

router.use("/admin",adminRoutes)

router.use("/car",carRoutes)

router.use("/cart",cartRoutes)

router.use("/review",reviewRoutes)



export {router as apiRouter}