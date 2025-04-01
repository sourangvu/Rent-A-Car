import { Booking } from "../models/bookingModel.js";
import { Car } from "../models/carModel.js";



export const getBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const booking = await Booking.findOne({ userId }).populate("cars.carId");
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" });
        }

        res.status(200).json({ data: booking, message: "Booking Fetched" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const newBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { carId } = req.body;

        // Find the car to ensure it exists and fetch its price
        const course = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car Not Found" });
        }

        // Find the user's booking or create a new one if it doesn't exist
        let booking = await Booking.findOne({ userId });
        if (!booking) {
            booking = new Booking({ userId, cars: [] });
        }

        // Check if the car is already in the booking
        const carExists = booking.car.some((item) => item.carId.equals(carId));
        if (carExists) {
            return res.status(400).json({ message: "Car Already In Booking" });
        }

        // Add the car to the booking
        booking.car.push({
            carId,
            price: Car.price,
        });

        // Recalculate the total price
        booking.calculateTotalPrice();

        await booking.save();

        res.status(200).json({ data: booking, message: "Car Added To Booking" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const removeCarFromBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { carId } = req.body;

        // Find the user's booking
        let booking = await Booking.findOne({ userId });
        if (!booking) {
            return res.status(404).json({ message: "Booking Not Found" });
        }

        // Remove the car from booking
        booking.car = booking.car.filter((item) => !item.carId.equals(carId));

        // Recalculate the total price
        booking.calculateTotalPrice();

        // Save the booking
        await booking.save();

        res.status(200).json({ data: booking, message: "Car Removed From Cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};