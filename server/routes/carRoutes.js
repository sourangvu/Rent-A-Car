import express from "express";
import { carDetails, createCar, deleteCar, getAllCars, updateCar } from "../controllers/carController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/multer.js";



const router = express.Router();


router.get("/getAllCars", getAllCars );


router.get("/getCarDetails/:carId", carDetails);


router.post("/createNewCar", adminAuth, upload.single("image"), createCar);

router.put("/updateCar/:carId", adminAuth, updateCar);

router.delete("/deleteCar/:carId", adminAuth, deleteCar);

export { router as carRoutes };