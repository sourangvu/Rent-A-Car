import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { Admin } from "../models/adminModel.js";
import { cloudinaryInstance } from "../config/cloudinary.js";
import { Booking } from "../models/bookingModel.js";
import { User } from "../models/userModel.js";
import { Car } from "../models/carModel.js";

const NODE_ENV = process.env.NODE_ENV;

export const adminSignup = async (req, res, next) => {
    try {

        //collect user data
        const { name, email, password, mobile,} = req.body;

        //admin data validation
        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: "All Fields Required" });
        }
        if (!req.file) {
                    return res.status(400).json({ error: "No file uploaded" });
                }
                //profilePic upload
                const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);

        //check if user already exist
        const adminExist = await Admin.findOne({ email });

        if (adminExist) {
            return res.status(400).json({ message: "Admin Already Exist" });
        }

        //password hashing
        const hashedPassword = bcrypt.hashSync(password, 10);

        //save to database
        const newAdmin = new Admin ({ 
            name, 
            email, 
            password: hashedPassword, 
            mobile, 
            profilePic: cloudinaryResponse.url  });
        await newAdmin.save();

        //generate token usig Id and role
        const token = generateToken(newAdmin._id, "admin");

        res.cookie("token", token,{
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        res.json({ data: newAdmin, message: "Admin Signup Successfull" });
        
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        console.log(error);
        
    }
}

export const adminLogin = async (req, res, next) =>{
    try {
        //collect user data
        const { email, password } = req.body;

        //data validation
        if (!email || !password ) {
            return res.status(400).json({ message: "All Fields required" });
        }

        // user exist - check
        const userExist = await Admin.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: "User Not Found" });
        }

        //password match with DB
        const passwordMatch = bcrypt.compareSync(password, userExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        //generate token
        const token = generateToken(userExist._id, "admin");

        res.cookie("token", token,{
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        delete userExist._doc.password;
        res.json({ data: userExist, message: "Login Successfull" });
        
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        console.log(error);
        
    }
}

export const adminProfile = async (req, res, next) => {
    try {
        //user Id
        const userId = req.user.id;
        const userData = await Admin.findById(userId).select("-password");

        res.json({ data: userData, message: "Admin Profile Fetched" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const adminProfileUpdate = async (req, res) => {
    try {
      const { name, email, password, mobile } = req.body;
      const userId = req.user.id;
  
      let profilePicUrl;
  
      // ✅ Upload new profile picture to Cloudinary if file exists
      if (req.file) {
        const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);
        profilePicUrl = uploadResult.secure_url;
      }
  
      const updateData = {
        name,
        email,
        mobile,
      };
  
      // Include profilePic if uploaded
      if (profilePicUrl) {
        updateData.profilePic = profilePicUrl;
      }
  
      // If password provided, hash it
      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
  
      // Update admin data
      const updatedAdmin = await Admin.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
  
      if (!updatedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      res.status(200).json({ data: updatedAdmin, message: 'Admin Profile Updated' });
    } catch (error) {
      console.error('Update Error:', error);
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  };

export const adminLogout = async (req, res, next) => {
    try {
        res.clearCookie("token",{
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        res.json({  message: "Logout Successfull" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const checkAdmin = async (req, res, next) => {
    try {

        res.json({  message: "Admin Authorized" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
      const { bookingId, status } = req.body;
  
      if (!bookingId || !status) {
        return res.status(400).json({ error: "Missing bookingId or status" });
      }
  
      // Valid statuses from Mongoose schema
      const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancellation_requested', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
  
      // Update booking
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
      ).populate('user').populate('carId');
  
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      res.status(200).json({
        message: "Booking status updated",
        booking: updatedBooking
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message
      });
    }
  };

export const updatePaymentStatus = async (req, res) => {
    try {
      const { bookingId, paymentStatus } = req.body;
  
      if (!bookingId || !paymentStatus) {
        return res.status(400).json({ message: 'Booking ID and payment status are required' });
      }
  
      // Find the booking by ID
      const booking = await Booking.findById(bookingId);
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Validate payment status (optional)
      const validPaymentStatuses = ['pending', 'success', 'failed', 'refunded'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' });
      }
  
      // Update the payment status
      booking.paymentStatus = paymentStatus;
      await booking.save();
  
      res.status(200).json({ message: 'Payment status updated successfully' });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const getAdminStats = async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalCars = await Car.countDocuments();
      const totalBookings = await Booking.countDocuments();
  
      const earningsAgg = await Booking.aggregate([
        {
          $match: {
            status: { $nin: ["cancelled", "cancellation_requested"] },
            paymentStatus: "success"
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" }
          }
        }
      ]);
  
      const totalEarnings = earningsAgg.length > 0 ? earningsAgg[0].total : 0;
  
      res.status(200).json({
        totalUsers,
        totalCars,
        totalBookings,
        totalEarnings
      });
  
    } catch (err) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
  };

