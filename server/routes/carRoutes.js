import express from "express";
import { carDetails, createCar, getAllCars } from "../controllers/carController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/multer.js";



const router = express.Router();


router.get("/getAllCars", getAllCars );


router.get("/getCarDetails/:carId", carDetails);


router.post("/createNewCar", adminAuth, upload.single("image"), createCar);



export { router as carRoutes };