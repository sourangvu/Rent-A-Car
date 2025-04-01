import { Car } from "../models/carModel.js";
import { Review } from "../models/reviewModel.js";

export const addReview = async (req, res, next) => {
    try {
        const { carId, rating, comment } = req.body;
        const userId = req.user.id;

        // Validate if the car exists
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car Not Found" });
        }

        if (rating > 5 || rating < 1) {
            return res.status(400).json({ message: "Please Provide A Proper Rating" });
        }

        // Create or update the review
        const review = await Review.findOneAndUpdate({ userId, carId }, { rating, comment }, { new: true, upsert: true });

        // Optionally, you can update the car's average rating here

        res.status(201).json({ data: review, message: "Review Added" });
    } catch (error) {
        // next(error)

        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const getCarReviews = async (req, res) => {
    try {
        const { carId } = req.params;

        const reviews = await Review.find({ carId }).populate("userId", "name").sort({ createdAt: -1 });

        if (!reviews.length) {
            return res.status(404).json({ message: "No Reviews Found For This Car" });
        }

        res.status(200).json({ data: reviews, message: "Car Reviews Fetched" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });

        if (!review) {
            return res.status(404).json({ message: "Review Not Found Or Not Authorized" });
        }

        res.status(200).json({ message: "Review Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

export const getAverageRating = async (req, res) => {
    try {
        const { carId } = req.params;

        const reviews = await Review.find({ carId });

        if (!reviews.length) {
            return res.status(404).json({ message: "No Reviews Found For This Car" });
        }

        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        res.status(200).json({ data: averageRating, message: "Average Rating Fetched" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};