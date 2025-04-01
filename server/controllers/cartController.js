import { Car } from "../models/carModel.js";
import { Cart } from "../models/cartModel.js";


export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).populate("cars.carId");
        if (!cart) {
            return res.status(404).json({ message: "Cart Not Found" });
        }

        res.status(200).json({ data: cart, message: "Cart Fetched" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const addCarToCart = async (req, res) => {
    try {
        
        const userId = req.user.id;  
        const carId = req.body.carId; 

        // Ensure that carId exists in the request body
        if (!carId) {
            return res.status(400).json({ message: "Car Id Is Required" });
        }

        // Find the car to ensure it exists and fetch its price
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car Not Found" });
        }

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, cars: [] });
        }

        // Check if the car is already in the cart
        const carExists = cart.cars.some((item) => item.carId.equals(carId));
        if (carExists) {
            return res.status(400).json({ message: "Car Already In Cart" });
        }

        // Add the car to the cart
        cart.cars.push({
            carId,
            price: car.price,
        });

        // Recalculate the total price
        cart.calculateTotalPrice();

        await cart.save();

        res.status(200).json({ data: cart, message: "Car Added To Cart" });
    } catch (error) {
        console.error(error);  
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const removeCarFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const carId = req.body.carId;

        // Find the user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart Not Found" });
        }

        // Remove the car from the cart
        cart.cars = cart.cars.filter((item) => !item.carId.equals(carId));

        // Recalculate the total price
        cart.calculateTotalPrice();

        // Save the cart
        await cart.save();

        res.status(200).json({ data: cart, message: "Car Removed From Cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        

        const cart = await Cart.findOne({ userId });
        cart.cars = [];
        cart.calculateTotalPrice()
        await cart.save();

        res.status(200).json({ message:"Cart Cleared Successfully", data:cart})


    } catch (error) {
        res.status(error.status || 500).json({message:error.message || "Internal Server Error", error })
    }

}