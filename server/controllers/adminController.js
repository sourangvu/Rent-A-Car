import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { Admin } from "../models/adminModel.js";
import { cloudinaryInstance } from "../config/cloudinary.js";

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

export const adminProfieUpdate = async (req, res, next) => {
    try {
        const { name, email, password, mobile, profilePic } = req.body;

        //user Id
        const userId = req.user.id;
        const userData = await Admin.findByIdAndUpdate(
            userId,
            { name, email, password, mobile, profilePic },
            { new: true }
        );

        res.json({ data: userData, message: "Admin Profile Updated" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
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

