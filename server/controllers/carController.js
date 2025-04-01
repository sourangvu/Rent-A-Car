import { cloudinaryInstance } from "../config/cloudinary.js";
import { Car } from "../models/carModel.js";

export const getAllCars = async (req, res, next) => {
    try {
        const carList = await Car.find();

        res.json({ data: carList ,message:" Car List Fetched"})
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const carDetails = async (req, res, next) => {
    try {
        const { carId } = req.params;

        const carDetails = await Car.findById(carId).populate("admin");
       

        res.json({ data:  carDetails, message: "Car Details Fetched" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const createCar = async (req, res, next) => {
    try {
        const { name, description, price, image,} = req.body;

        const adminId = req.user.id

        const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);

        const newCar = new Car({ 
            name,
            description,
            price,
            image: cloudinaryResponse.url,
            admin : adminId });
        newCar.save();

        res.json({ data:newCar, message:"New Car Created Successfully" })

        
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};