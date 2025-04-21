import express from "express";
import { adminLogin, adminLogout, adminProfile, adminProfileUpdate, adminSignup, checkAdmin, getAdminStats, updateBookingStatus, updatePaymentStatus } from "../controllers/adminController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/multer.js";
import {  getAllCars } from "../controllers/carController.js";



const router = express.Router();


//sign up
router.post("/signup", upload.single("profilePic"), adminSignup);

//login
router.put("/login", adminLogin);

//profile
router.get("/profile", adminAuth, adminProfile);

//profile-edit
router.put("/profile-update",upload.single("profilePic"), adminAuth, adminProfileUpdate);

//delete
router.delete("/delete-account");

//logout
router.get("/logout", adminLogout);

//check-user
router.get("/check-admin", adminAuth, checkAdmin);

router.get("/getAllCars", adminAuth, getAllCars );

router.put("/update-booking-status", adminAuth, updateBookingStatus);

router.put('/update-payment-status', adminAuth, updatePaymentStatus);

router.get('/stats',adminAuth, getAdminStats);










export { router as adminRoutes };