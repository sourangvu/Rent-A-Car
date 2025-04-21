import { cloudinaryInstance } from "../config/cloudinary.js";
import { Car } from "../models/carModel.js";

export const getAllCars = async (req, res, next) => {
    try {
        // Fetch all cars from the database
        const carList = await Car.find();

        res.json({ data: carList, message: "Car List Fetched" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const carDetails = async (req, res, next) => {
    try {
        const { carId } = req.params;

        // Fetch car details by ID and populate admin details
        const carDetails = await Car.findById(carId).populate("admin");

        if (!carDetails) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.json({ data: carDetails, message: "Car Details Fetched" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const createCar = async (req, res, next) => {
    try {
        const { name, brand, year, model, description, price } = req.body;

        // Validate input fields
        if (!name || !brand || !year || !model || !description || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (year < 1900 || year > new Date().getFullYear()) {
            return res.status(400).json({ message: "Invalid year" });
        }

        // Admin ID should be from the authenticated user (assumed to be available as req.user.id)
        const adminId = req.user.id;

        // Handle image upload if file exists
        let imageUrl = "https://image.pngaaa.com/13/1887013-middle.png";
        if (req.file) {
            const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            imageUrl = cloudinaryResponse.url;
        }

        // Create a new Car object
        const newCar = new Car({
            name,
            brand,
            year,
            model,
            description,
            price,
            image: imageUrl,
            admin: adminId
        });

        // Save the new car to the database
        await newCar.save();

        res.json({ data: newCar, message: "New Car Created Successfully" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const updateCar = async (req, res, next) => {
    try {
        const { carId } = req.params;
        const { name, brand, year, model, description, price } = req.body;

        // Log the carId to verify it's being passed correctly
        console.log('Car ID:', carId);

        // Find the car by ID
        const car = await Car.findById(carId);
        
        // Log the fetched car to check if it's null
        console.log('Fetched Car:', car);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        // Update fields
        car.name = name || car.name;
        car.brand = brand || car.brand;
        car.year = year || car.year;
        car.model = model || car.model;
        car.description = description || car.description;
        car.price = price || car.price;

        // Handle image upload if file exists
        if (req.file) {
            const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
            car.image = cloudinaryResponse.url;
        }

        // Save updated car
        await car.save();

        res.json({ data: car, message: "Car Updated Successfully" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const deleteCar = async (req, res, next) => {
    try {
        const { carId } = req.params;

        // Find and delete the car by ID
        const car = await Car.findByIdAndDelete(carId);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        res.json({ message: "Car Deleted Successfully" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};