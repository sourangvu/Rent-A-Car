import express from "express";
import { checkUser, userLogin, userLogout, userProfieUpdate, userProfile, userSignup } from "../controllers/userController.js";
import { userAuth } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();


//sign up
router.post("/signup", upload.single("profilePic"), userSignup);

//login
router.put("/login", userLogin);

//profile
router.get("/profile", userAuth, userProfile);

//profile-edit
router.put("/profile-update", userAuth, userProfieUpdate);

//delete
router.delete("/delete-account");

//logout
router.post("/logout",userAuth, userLogout);

//check-user
router.get("/check-user", userAuth, checkUser);


export { router as userRoutes };