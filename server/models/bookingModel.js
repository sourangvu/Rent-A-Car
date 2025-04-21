import mongoose, { Schema } from "mongoose";

// Booking Schema Definition
const bookingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  pickUpDate: {
    type: Date,
    required: true,
  },
  pickUpTime: {
    type: String,
    required: true,
  },
  pickUpLocation: {
    type: String,
    required: true,
  },
  dropOffLocation: {
    type: String,
    required: true,
  },
  dropOffDate: {
    type: Date, 
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancellation_requested', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentIntentId: {
    type: String,
  },
  refundRequested: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Method to calculate the total price based on car price and duration
bookingSchema.methods.calculateTotalPrice = async function () {
  try {
    await this.populate('carId');

    if (!this.carId || !this.carId.price) {
      throw new Error("Car data not populated correctly");
    }

    // Calculate duration in days
    const oneDay = 1000 * 60 * 60 * 24;
    const pickUp = new Date(this.pickUpDate);
    const dropOff = new Date(this.dropOffDate);

    const durationInDays = Math.max(1, Math.ceil((dropOff - pickUp) / oneDay));

    this.totalPrice = this.carId.price * durationInDays;
    return this.totalPrice;
  } catch (error) {
    console.error("Error calculating total price:", error);
    throw new Error("Could not calculate total price");
  }
};

// Export the model
export const Booking = mongoose.model('Booking', bookingSchema);