import express from "express";
import {  approveCancelBooking, getAllBookings, getUserBookings, newBooking, requestCancelBooking, requestRefund, updateBooking, updatePaymentStatus } from "../controllers/bookingController.js";
import { userAuth } from "../middlewares/userAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js";


const router = express.Router();

router.get('/allBookings', adminAuth, getAllBookings);

router.get('/getBookings/:userId', userAuth, getUserBookings );

router.post('/newBooking', userAuth, newBooking);

router.put('/updateBooking', userAuth, updateBooking);

router.put('/update-payment-status', userAuth, updatePaymentStatus);



router.post("/request-cancel", userAuth, requestCancelBooking);

router.post('/approve-cancel-booking', adminAuth, approveCancelBooking);

router.put("/request-refund/:bookingId", userAuth, requestRefund);





export { router as bookingRoutes }