import { Booking } from "../models/bookingModel.js";
import { Car } from "../models/carModel.js";
import mongoose from "mongoose";
import Stripe from 'stripe';


export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('carId')
      .populate('user')
      .exec();

    if (bookings.length === 0) {
      console.log('No bookings found.');
    }

    res.status(200).json({ data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id; 

    const bookings = await Booking.find({ user: userId })
      .populate('carId')
      .populate('user')
      .exec();

    if (bookings.length === 0) {
      console.log(`No bookings found for user ${userId}.`);
    }

    res.status(200).json({ data: bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


export const newBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      carId: _id,
      pickUpDate,
      dropOffDate,
      pickUpTime,
      pickUpLocation,
      dropOffLocation
    } = req.body;

    // Ensure all required fields are present
    if (!pickUpDate || !pickUpTime || !pickUpLocation || !dropOffLocation || !dropOffDate) {
      return res.status(400).json({
        message: "Missing required booking information",
        missingFields: {
          pickUpDate: !pickUpDate,
          pickUpTime: !pickUpTime,
          pickUpLocation: !pickUpLocation,
          dropOffLocation: !dropOffLocation,
          dropOffDate: !dropOffDate
        }
      });
    }

    // Validate the carId format
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid Car ID" });
    }

    // Fetch the car from the database
    const car = await Car.findById(_id);
    if (!car) {
      return res.status(404).json({ message: "Car Not Found" });
    }

    // Check if the user already has an active booking
    const existingBooking = await Booking.findOne({
      userId,
      status: { $nin: ['completed', 'cancelled'] },
      paymentStatus: 'success',
    });
    if (existingBooking) {
      return res.status(400).json({
        message: "You already have an active booking. Please complete it before making a new one."
      });
    }

    // Calculate duration in days
    const startDate = new Date(pickUpDate);
    const endDate = new Date(dropOffDate);
    if (endDate < startDate) {
      return res.status(400).json({ message: "Drop-off date must be after pick-up date" });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const rentalDays = Math.ceil((endDate - startDate) / msPerDay) || 1;
    const totalPrice = car.price * rentalDays;

    // Create the booking
    const booking = new Booking({
      user: userId,
      carId: car._id,
      pickUpDate,
      dropOffDate,
      pickUpTime,
      pickUpLocation,
      dropOffLocation,
      totalPrice,
    });

    await booking.save();

    res.status(200).json({
      data: booking,
      message: "Car Booked Successfully"
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      bookingId,
      carId,
      action,
      pickUpDate,
      pickUpTime,
      pickUpLocation,
      dropOffLocation,
      dropOffDate
    } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    if (!carId && !pickUpDate && !pickUpTime && !pickUpLocation && !dropOffLocation && !dropOffDate) {
      return res.status(400).json({ message: "No valid update information provided" });
    }

    let booking = await Booking.findOne({ _id: bookingId, user: userId }).populate('carId');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found or you don't have permission to update this booking" });
    }

    //  Restrict updates to completed or cancelled bookings
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: `Cannot update a ${booking.status} booking.` });
    }

    //  Restrict updates if payment was successful
    if (booking.paymentStatus === 'success') {
      return res.status(400).json({ message: "Cannot update a paid booking." });
    }

    //  Update car if needed
    if (carId && mongoose.Types.ObjectId.isValid(carId)) {
      const car = await Car.findById(carId);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      booking.carId = car._id;
    }

    // Update other fields
    if (pickUpDate) booking.pickUpDate = pickUpDate;
    if (dropOffDate) booking.dropOffDate = dropOffDate;
    if (pickUpTime) booking.pickUpTime = pickUpTime;
    if (pickUpLocation) booking.pickUpLocation = pickUpLocation;
    if (dropOffLocation) booking.dropOffLocation = dropOffLocation;

    //  Get car again (in case it's updated)
    const car = await Car.findById(booking.carId);
    if (!car) {
      return res.status(404).json({ message: "Associated car not found" });
    }

    //  Calculate duration and total price
    const startDate = new Date(booking.pickUpDate);
    const endDate = new Date(booking.dropOffDate);

    if (endDate < startDate) {
      return res.status(400).json({ message: "Drop-off date must be after pick-up date" });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const rentalDays = Math.ceil((endDate - startDate) / msPerDay) || 1;

    //  Minimum rental duration check (e.g., 1 day minimum)
    if (rentalDays < 1) {
      return res.status(400).json({ message: "Minimum booking duration is 1 day" });
    }

    //  Calculate price 
    booking.totalPrice = car.price * rentalDays;

    await booking.save();

    res.status(200).json({
      data: booking,
      message: "Booking updated successfully",
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
    const { bookingId, session_Id } = req.body;
    console.log(bookingId,session_Id);
    
  
    try {
      // Retrieve session from Stripe
      const session = await stripe.checkout.sessions.retrieve(session_Id);
  
      if (!session || !session.payment_intent) {
        return res.status(400).json({ message: "Invalid session or missing payment intent" });
      }
  
      // Update booking with payment status and payment intent ID
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: "success",
          status: "confirmed",
          paymentIntentId: session.payment_intent,
        },
        { new: true }
      );
  
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      res.status(200).json({ message: "Booking updated", booking: updatedBooking });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Failed to update booking", error: error.message });
    }
  };
  

  export const requestCancelBooking = async (req, res) => {
    const { bookingId } = req.body;
  
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ message: "Booking not found" });
  
      if (booking.status === "cancelled") {
        return res.status(400).json({ message: "Booking already cancelled" });
      }
  
      if (booking.status === "cancellation_requested") {
        return res.status(400).json({ message: "Cancellation already requested" });
      }
  
      booking.status = "cancellation_requested";
      await booking.save();
  
      res.status(200).json({ message: "Cancellation requested successfully", booking });
    } catch (err) {
      console.error("Cancellation request error:", err.message);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };


  const stripe = new Stripe(process.env.Stripe_Private_Api_Key);

export const approveCancelBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const paymentIntentId = booking.paymentIntentId;
    if (!paymentIntentId) return res.status(400).json({ message: "No PaymentIntent ID" });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['charges'],
    });

    const charge = paymentIntent.charges?.data[0];
    if (!charge) return res.status(400).json({ message: "No charge found" });

    if (!charge.refunded) {
      await stripe.refunds.create({ payment_intent: paymentIntentId });
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled and refunded", booking });
  } catch (err) {
    console.error("Approval error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const requestRefund = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "cancelled") {
      return res.status(400).json({ message: "Refund only allowed for cancelled bookings" });
    }

    if (booking.paymentStatus !== "success") {
      return res.status(400).json({ message: "Only paid bookings can be refunded" });
    }

    if (booking.refundRequested) {
      return res.status(400).json({ message: "Refund already requested" });
    }

    booking.refundRequested = true;
    await booking.save();

    res.status(200).json({ message: "Refund requested successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error requesting refund", error: err.message });
  }
};