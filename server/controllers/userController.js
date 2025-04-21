import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { cloudinaryInstance } from "../config/cloudinary.js";

const NODE_ENV = process.env.NODE_ENV;

export const userSignup = async (req, res, next) => {
    try {

        //collect user data
        const { name, email, password, mobile } = req.body;
        console.log(req.body);
        

        //user data validation
        if (!name || !email || !password || !mobile ) {
            return res.status(400).json({ message: "All Fields Required" });
            
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        //profilePic upload
        const cloudinaryResponse = await cloudinaryInstance.uploader.upload(req.file.path);
        console.log("upload result=====", cloudinaryResponse)

        //check if user already exist
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "User Already Exist" });
        }

        //password hashing
        const hashedPassword = bcrypt.hashSync(password, 10);

        //save to database
        const newUser = new User({ 
            name,
            email,
            password: hashedPassword,
            mobile,
            profilePic: cloudinaryResponse.url });
        await newUser.save();

        //generate token usig Id and role
        const token = generateToken(newUser._id, "user");
        //store token
        res.cookie("token", token, {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        res.json({ data: newUser, message: " User Signup Successfull" });
        
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
        console.log(error);
        
    }
}

export const userLogin = async (req, res, next) =>{
    try {
        //collect user data
        const { email, password } = req.body;

        //data validation
        if (!email || !password ) {
            return res.status(400).json({ message: "All Fields required" });
        }

        // user exist - check
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: "User Not Found" });
        }

        //password match with DB
        const passwordMatch = bcrypt.compareSync(password, userExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        if (!userExist.isActive) {
            return res.status(401).json({ message: "User Account Is Not Active" });
        }

        //generate token
        const token = generateToken(userExist._id, "user");

        //store token
        res.cookie("token", token, {
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

export const userProfile = async (req, res, next) => {
    try {
        //user Id
        const userId = req.user.id;
        const userData = await User.findById(userId).select("-password");

        res.json({ data: userData, message: "User Profile Fetched" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const userProfileUpdate = async (req, res) => {
    try {
      const { name, email, password, mobile } = req.body;
      const userId = req.user.id;
  
      let profilePicUrl;
  
      // ✅ Upload profile picture to Cloudinary if file exists
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
  
      // Update user data
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ data: updatedUser, message: 'User Profile Updated' });
    } catch (error) {
      console.error('Update Error:', error);
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' });
    }
  };
  

export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        res.json({  message: "User Logout Successfull" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        // Fetch all users from the database
        const userList = await User.find();

        res.json({ data: userList, message: "User List Fetched" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const authenticatedUser = req.user;

        // Log for debugging
        console.log("Authenticated user:", authenticatedUser);
        console.log("UserID to delete:", userId);

        // Only admin or the user themselves can delete
        if (authenticatedUser.role !== 'admin' && authenticatedUser.id !== userId) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to delete this user" });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const checkUser = async (req, res, next) => {
    try {

        res.json({  message: "User Authorized" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};