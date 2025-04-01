import express from "express";
import { adminLogin, adminLogout, adminProfieUpdate, adminProfile, adminSignup, checkAdmin } from "../controllers/adminController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();


//sign up
router.post("/signup", upload.single("profilePic"), adminSignup);

//login
router.put("/login", adminLogin);

//profile
router.get("/profile", adminAuth, adminProfile);

//profile-edit
router.put("/profile-update", adminAuth, adminProfieUpdate);

//delete
router.delete("/delete-account");

//logout
router.get("/logout", adminLogout);

//check-user
router.get("/check-user", adminAuth, checkAdmin);


export { router as adminRoutes };