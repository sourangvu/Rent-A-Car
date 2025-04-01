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

export const userProfieUpdate = async (req, res, next) => {
    try {
        const { name, email, password, mobile, profilePic } = req.body;

        //user Id
        const userId = req.user.id;
        const userData = await User.findByIdAndUpdate(
            userId,
            { name, email, password, confirmPassword, mobile, profilePic },
            { new: true }
        );

        res.json({ data: userData, message: "User Profile Updated" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
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

export const checkUser = async (req, res, next) => {
    try {

        res.json({  message: "User Authorized" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};