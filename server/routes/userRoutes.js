import express from "express";
import { checkUser, userLogin, userLogout, userProfile, userSignup ,deleteUser, getAllUsers, userProfileUpdate} from "../controllers/userController.js";
import { userAuth } from "../middlewares/userAuth.js";
import { upload } from "../middlewares/multer.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();


//sign up
router.post("/signup", upload.single("profilePic"), userSignup);

//login
router.put("/login", userLogin);

//profile
router.get("/profile", userAuth, userProfile);

//profile-edit
router.put("/profile-update", upload.single("profilePic"), userAuth, userProfileUpdate);

//delete
router.delete("/delete-account/:userId", userAuth, deleteUser);

//logout
router.post("/logout",userAuth, userLogout);

//check-user
router.get("/check-user", userAuth, checkUser);

router.get("/getAllUsers", adminAuth, getAllUsers  );

export { router as userRoutes };